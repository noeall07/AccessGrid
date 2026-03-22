from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    role = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(64))
    department = db.Column(db.String(64))
    student_id = db.Column(db.String(20))
 # Changed backref name to avoid conflict

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'name': self.name,
            'department': self.department,
            'studentId': self.student_id
        }

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), index=True, unique=True, nullable=False)
    type = db.Column(db.String(20))  # Staff, Student, Visitor
    owner_name = db.Column(db.String(64))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    department = db.Column(db.String(64))
    status = db.Column(db.String(20), default='active')  # active, inactive
    is_inside = db.Column(db.Boolean, default=False)
    logs = db.relationship('EntryLog', backref='vehicle', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'plate': self.plate_number,
            'type': self.type,
            'owner': self.owner_name,
            'ownerId': self.owner_id,
            'department': self.department,
            'status': self.status,
            'isInside': self.is_inside
        }

class ParkingZone(db.Model):
    id = db.Column(db.String(5), primary_key=True) # A, B, C, D
    name = db.Column(db.String(64))
    label = db.Column(db.String(64))
    capacity = db.Column(db.Integer)
    occupied_count = db.Column(db.Integer, default=0)
    is_restricted = db.Column(db.Boolean, default=False)
    color = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'label': self.label,
            'capacity': self.capacity,
            'occupied': self.occupied_count,
            'restricted': self.is_restricted,
            'color': self.color
        }

class EntryLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    action = db.Column(db.String(10))  # entry, exit
    gate_name = db.Column(db.String(50))
    image_path = db.Column(db.String(200)) # Path to captured image
    manual_entry = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
        'id': self.id,
        'vehicleId': self.vehicle_id,
        'plate': self.vehicle.plate_number if self.vehicle else 'Unknown',
        'owner': self.vehicle.owner_name if self.vehicle else None,
        'type': self.vehicle.type if self.vehicle else None,
        'timestamp': self.timestamp.isoformat(),
        'action': self.action,
        'gate': self.gate_name,
        'image': self.image_path
    }
