from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from config import Config


db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = 'auth.login'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True, resources={r"/api/*":{"origins":"*"}})
    login.init_app(app)

    # Import and register blueprints
    from app.routes.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes.vehicles import bp as vehicles_bp
    app.register_blueprint(vehicles_bp, url_prefix='/api/vehicles')
    
    from app.routes.gate import bp as gate_bp
    app.register_blueprint(gate_bp, url_prefix='/api/gate')

    from app.routes.parking import bp as parking_bp
    app.register_blueprint(parking_bp, url_prefix='/api/parking')

    from app.routes.stats import bp as stats_bp
    app.register_blueprint(stats_bp, url_prefix='/api/stats')

    from app.routes.anpr_routes import anpr_bp
    app.register_blueprint(anpr_bp, url_prefix='/api/anpr')

    return app

from app import models

@login.user_loader
def load_user(id):
    return models.User.query.get(int(id))

