import cv2
import cv2
import pytesseract
from ultralytics import YOLO
import re

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

model = YOLO("runs/detect/train/weights/best.pt")

def clean_plate(text):
    text = text.upper()
    text = re.sub(r'[^A-Z0-9]', '', text)

    chars = list(text)

    for i, c in enumerate(chars):
        if i < 2:
            if c == '1':
                chars[i] = 'I'
            if c == '0':
                chars[i] = 'O'
            if c == 'I':
                chars[i] = 'H'
        elif 2 <= i < 4:
            corrections = {'O':'0','I':'1','Z':'2','S':'5','B':'8','G':'6','T':'7'}
            if c in corrections:
                chars[i] = corrections[c]
        elif 4 <= i < 6:
            if c == '0':
                chars[i] = 'O'
            if c == '1':
                chars[i] = 'I'
        else:
            corrections = {'O':'0','I':'1','Z':'2','S':'5','B':'8','G':'6','T':'7'}
            if c in corrections:
                chars[i] = corrections[c]

    return "".join(chars)

def detect_plate(image_path):
    image = cv2.imread(image_path)
    results = model(image)
    boxes = results[0].boxes.xyxy

    if len(boxes) == 0:
        print("No license plate detected")
        return None

    x1, y1, x2, y2 = map(int, boxes[0])
    plate = image[y1:y2, x1:x2]
    plate = cv2.resize(plate, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(3,3))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    text = pytesseract.image_to_string(thresh, config='--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    text = clean_plate(text)
    print("License Plate:", text)
    cv2.imshow("Plate",plate)
    cv2.imshow("Gray",gray)
    cv2.imshow("Threshold", thresh)
    cv2.waitKey(1)
detect_plate(r"C:\VSC PROJECTS\REACT\ACCESSGRIDNEW\anpr\dataset\test\images\Cars101_png.rf.8a5ecd723af96ddac8c71bf15f70146a.jpg")



