from flask import Blueprint, jsonify, request
from app import db
from app.models import Vehicle, EntryLog, ParkingZone
from datetime import datetime, timedelta
from sqlalchemy import func

bp = Blueprint('stats', __name__)

@bp.route('/', methods=['GET'])
def get_stats():
    role = request.args.get('role', 'admin')
    
    total_vehicles = Vehicle.query.count()
    vehicles_inside = Vehicle.query.filter_by(is_inside=True).count()
    staff_vehicles = Vehicle.query.filter_by(type='Staff').count()
    
    # Today's entries and exits
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    entries_today = EntryLog.query.filter(
        EntryLog.timestamp >= today_start,
        EntryLog.action == 'entry'
    ).count()
    exits_today = EntryLog.query.filter(
        EntryLog.timestamp >= today_start,
        EntryLog.action == 'exit'
    ).count()
    
    # Parking capacity
    zones = ParkingZone.query.all()
    total_capacity = sum(z.capacity for z in zones) if zones else 200
    total_occupied = sum(z.occupied_count for z in zones) if zones else 0
    parking_pct = round((total_occupied / total_capacity) * 100) if total_capacity else 0
    
    if role == 'admin':
        return jsonify([
            { 'title': 'Total Registered', 'value': str(total_vehicles), 'change': '', 'trend': 'neutral', 'icon': 'car' },
            { 'title': 'Staff Vehicles', 'value': str(staff_vehicles), 'change': '', 'trend': 'neutral', 'icon': 'users' },
            { 'title': 'Parking Capacity', 'value': f'{parking_pct}%', 'change': '', 'trend': 'neutral', 'icon': 'parking' },
            { 'title': 'Active Sessions', 'value': str(vehicles_inside), 'change': '', 'trend': 'neutral', 'icon': 'clock' },
        ])
    elif role == 'security':
        pending = Vehicle.query.filter_by(is_inside=True, type='Unknown').count()
        return jsonify([
            { 'title': 'Vehicles Inside', 'value': str(vehicles_inside), 'change': '', 'trend': 'neutral', 'icon': 'car' },
            { 'title': 'Entries Today', 'value': str(entries_today), 'change': '', 'trend': 'neutral', 'icon': 'entry' },
            { 'title': 'Exits Today', 'value': str(exits_today), 'change': '', 'trend': 'neutral', 'icon': 'exit' },
            { 'title': 'Pending Scans', 'value': str(pending), 'change': '', 'trend': 'neutral', 'icon': 'alert' },
        ])
    else:  # student
        user_id = request.args.get('user_id', type=int)
        vehicle = Vehicle.query.filter_by(owner_id=user_id).first() if user_id else None
        total_visits = 0
        if vehicle:
            total_visits = EntryLog.query.filter_by(vehicle_id=vehicle.id, action='entry').count()

        late_count = 0  # placeholder for late entry tracking
        current_status = 'Inside' if (vehicle and vehicle.is_inside) else 'Outside'
        return jsonify([
            { 'title': 'Total Visits', 'value': str(total_visits), 'change': '', 'trend': 'neutral', 'icon': 'car' },
            { 'title': 'Avg. Duration', 'value': '-', 'change': '', 'trend': 'neutral', 'icon': 'clock' },
            { 'title': 'Late Entries', 'value': str(late_count), 'change': '', 'trend': 'neutral', 'icon': 'alert' },
            { 'title': 'Current Status', 'value': current_status, 'change': '', 'trend': 'neutral', 'icon': 'check' },
        ])
