from flask import jsonify, request, Blueprint
from app import db
from app.models import Vehicle, User

bp = Blueprint('vehicles', __name__)

@bp.route('/', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles])

@bp.route('/', methods=['POST'])
def add_vehicle():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('plate') or not data.get('type') or not data.get('owner'):
        return jsonify({'error': 'Missing required fields: plate, type, owner'}), 400

    # Check for duplicate plate
    if Vehicle.query.filter_by(plate_number=data['plate']).first():
        return jsonify({'error': 'Plate number already registered'}), 409

    vehicle = Vehicle(
        plate_number=data['plate'],
        type=data['type'],
        owner_name=data['owner'],
        owner_id=data.get('ownerId'),
        department=data.get('department'),
        status='active'
    )

    try:
        db.session.add(vehicle)
        db.session.commit()
        return jsonify(vehicle.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400