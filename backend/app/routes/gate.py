import os
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from app import db
from app.models import Vehicle, EntryLog
from app.utils.ocr import detect_license_plate
from datetime import datetime
from sqlalchemy.orm import joinedload

bp = Blueprint('gate', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/scan', methods=['POST'])
def scan_vehicle():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Perform OCR
        detected_text = detect_license_plate(filepath)
        
        # Clean up text (remove spaces, etc if needed)
        clean_text = detected_text.replace(' ', '').replace('-', '').upper() if detected_text else ""
        
        # Check against database
        # Try exact match or partial match
        # For simplicity, let's assume exact match on plate_number stored in DB (which might have hyphens)
        # We should probably normalize DB plates too for comparison, but let's try direct first.
        
        vehicle = Vehicle.query.filter(Vehicle.plate_number.ilike(f"%{clean_text}%")).first()
        
        result = {
            'plate': detected_text, # Return raw detected text for user verification
            'clean_plate': clean_text,
            'registered': False,
            'status': 'unregistered'
        }
        
        if vehicle:
            result.update(vehicle.to_dict())
            result['registered'] = True
            result['status'] = 'verified'
        else:
             # Basic object for unknown vehicle
            result['type'] = 'Unknown'
            result['owner'] = 'Not Found'
            
        return jsonify(result)
        
    return jsonify({'error': 'Invalid file type'}), 400

@bp.route('/entry', methods=['POST'])
def vehicle_entry():
    data = request.get_json()
    plate = data.get('plate')
    
    vehicle = Vehicle.query.filter_by(plate_number=plate).first()
    
    if vehicle:
        vehicle.is_inside = True
        vehicle_id = vehicle.id
    else:
        # Log entry for unknown vehicle?
        # Maybe create a temporary visitor vehicle record?
        # For now, just log with null vehicle_id if we want, but EntryLog requires vehicle_id usually?
        # Let's make vehicle_id nullable in model or require creating a visitor vehicle first.
        # Flow: "Allow Entry" in frontend -> creates vehicle if not exists?
        # Front end sends { plate, type, owner ... } for unregistered cars.
        
        # Quick-create visitor vehicle
        vehicle = Vehicle(
            plate_number=plate,
            type=data.get('type', 'Visitor'),
            owner_name=data.get('owner', 'Guest'),
            status='active',
            is_inside=True
        )
        db.session.add(vehicle)
        db.session.flush() # get ID
        vehicle_id = vehicle.id

    entry_log = EntryLog(
        vehicle_id=vehicle_id,
        action='entry',
        gate_name=data.get('gate', 'Main Gate'),
        manual_entry=data.get('manual', False)
    )
    
    db.session.add(entry_log)
    db.session.commit()
    
    return jsonify({'message': 'Entry recorded', 'log': entry_log.to_dict()})

@bp.route('/exit', methods=['POST'])
def vehicle_exit():
    data = request.get_json()
    plate = data.get('plate')
    
    vehicle = Vehicle.query.filter_by(plate_number=plate).first()
    if not vehicle:
         return jsonify({'error': 'Vehicle not found'}), 404
         
    vehicle.is_inside = False
    
    entry_log = EntryLog(
        vehicle_id=vehicle.id,
        action='exit',
        gate_name=data.get('gate', 'Main Gate'),
        manual_entry=data.get('manual', False)
    )
    
    db.session.add(entry_log)
    db.session.commit()
    
    return jsonify({'message': 'Exit recorded', 'log': entry_log.to_dict()})

@bp.route('/logs', methods=['GET'])
def get_logs():
    vehicle_id = request.args.get('vehicle_id', type=int)
    limit = request.args.get('limit', 50, type=int)

    query = EntryLog.query.options(
        joinedload(EntryLog.vehicle)
    ).order_by(EntryLog.timestamp.desc())

    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    logs = query.limit(limit).all()
    return jsonify([log.to_dict() for log in logs])
