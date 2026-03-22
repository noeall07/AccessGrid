from flask import jsonify, Blueprint
from app.models import ParkingZone

bp = Blueprint('parking', __name__)

@bp.route('/zones', methods=['GET'])
def get_zones():
    zones = ParkingZone.query.all()
    # If no zones exist, might want to initialize them?
    # For now, just return what's there.
    return jsonify([z.to_dict() for z in zones])

@bp.route('/zones/<string:zone_id>', methods=['GET'])
def get_zone(zone_id):
    zone = ParkingZone.query.get(zone_id)
    if not zone:
        return jsonify({'error': 'Zone not found'}), 404
    return jsonify(zone.to_dict())
