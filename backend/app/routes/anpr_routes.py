from flask import Blueprint,request,jsonify
import cv2
import numpy as np 
from app.anpr.detector import detect_plate

anpr_bp = Blueprint("anpr",__name__)

@anpr_bp.route("/", methods=["POST"])
def detect_plate_api():
    if "image" not in request.files:
        return jsonify({"error":"no image uploaded"}),400

    file = request.files["image"]
    
    image_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

    plate = detect_plate(image)

    return jsonify({"plate":plate})

