"""
Seed script to populate the database with demo data.
Run: python seed.py
"""
from app import create_app, db
from app.models import User, Vehicle, ParkingZone, EntryLog
from datetime import datetime, timedelta

app = create_app()

def seed():
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()

        # ── Clear existing data ───────────────────────────────
        EntryLog.query.delete()
        Vehicle.query.delete()
        ParkingZone.query.delete()
        User.query.delete()
        db.session.commit()

        # ── Users ─────────────────────────────────────────────
        admin = User(username='admin', role='admin', name='Dr. Rajesh Kumar', department='Administration')
        admin.set_password('admin123')

        security = User(username='security', role='security', name='John Mathew', department='Security')
        security.set_password('security123')

        student = User(username='student', role='student', name='Arun Menon', department='Computer Science', student_id='FISAT2024001')
        student.set_password('student123')

        db.session.add_all([admin, security, student])
        db.session.flush()  # get IDs

        # ── Vehicles ──────────────────────────────────────────
        vehicles_data = [
            { 'plate': 'KL-07-AB-1234', 'type': 'Staff',   'owner': 'Dr. Rajesh Kumar',  'dept': 'Computer Science', 'owner_id': admin.id },
            { 'plate': 'KL-07-CD-5678', 'type': 'Staff',   'owner': 'Prof. Sarah John',  'dept': 'Electronics',      'owner_id': None },
            { 'plate': 'KL-08-EF-9012', 'type': 'Staff',   'owner': 'Dr. Meena Pillai',  'dept': 'Mechanical',       'owner_id': None },
            { 'plate': 'KL-07-GH-3456', 'type': 'Staff',   'owner': 'Dr. Thomas Mathew', 'dept': 'Civil',            'owner_id': None },
            { 'plate': 'KL-09-IJ-7890', 'type': 'HOD',     'owner': 'Dr. Anil Menon',    'dept': 'Computer Science', 'owner_id': None },
            { 'plate': 'KL-07-KL-2345', 'type': 'Staff',   'owner': 'Prof. Deepa Nair',  'dept': 'Mathematics',      'owner_id': None },
            { 'plate': 'KL-07-ST-4521', 'type': 'Student', 'owner': 'Arun Menon',        'dept': 'Computer Science', 'owner_id': student.id },
        ]

        vehicle_objects = []
        for v in vehicles_data:
            veh = Vehicle(
                plate_number=v['plate'],
                type=v['type'],
                owner_name=v['owner'],
                department=v['dept'],
                owner_id=v['owner_id'],
                status='active',
                is_inside=False
            )
            vehicle_objects.append(veh)

        db.session.add_all(vehicle_objects)
        db.session.flush()

        # Mark some vehicles as inside campus
        vehicle_objects[0].is_inside = True  # KL-07-AB-1234
        vehicle_objects[1].is_inside = True  # KL-07-CD-5678
        vehicle_objects[6].is_inside = True  # Student vehicle

        # ── Parking Zones ─────────────────────────────────────
        zones = [
            ParkingZone(id='A', name='Zone A', label='Staff Parking',   capacity=50,  occupied_count=38, is_restricted=False, color='#22c55e'),
            ParkingZone(id='B', name='Zone B', label='Faculty Parking', capacity=30,  occupied_count=24, is_restricted=False, color='#6366f1'),
            ParkingZone(id='C', name='Zone C', label='Student Parking', capacity=100, occupied_count=72, is_restricted=False, color='#f59e0b'),
            ParkingZone(id='D', name='Zone D', label='Visitor Parking', capacity=20,  occupied_count=8,  is_restricted=True,  color='#8b5cf6'),
        ]
        db.session.add_all(zones)

        # ── Entry Logs ────────────────────────────────────────
        now = datetime.utcnow()
        logs = [
            EntryLog(vehicle_id=vehicle_objects[0].id, action='entry', gate_name='Main Gate', timestamp=now - timedelta(hours=3)),
            EntryLog(vehicle_id=vehicle_objects[1].id, action='entry', gate_name='North Gate', timestamp=now - timedelta(hours=2)),
            EntryLog(vehicle_id=vehicle_objects[6].id, action='entry', gate_name='Main Gate', timestamp=now - timedelta(hours=1, minutes=30)),
            EntryLog(vehicle_id=vehicle_objects[2].id, action='entry', gate_name='Main Gate', timestamp=now - timedelta(hours=5)),
            EntryLog(vehicle_id=vehicle_objects[2].id, action='exit',  gate_name='Main Gate', timestamp=now - timedelta(hours=1)),
        ]
        db.session.add_all(logs)

        db.session.commit()
        print('✅ Database seeded successfully!')
        print(f'   - {len([admin, security, student])} users')
        print(f'   - {len(vehicle_objects)} vehicles')
        print(f'   - {len(zones)} parking zones')
        print(f'   - {len(logs)} entry logs')

if __name__ == '__main__':
    seed()
