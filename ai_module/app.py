import os
import cv2
import re
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from skimage.metrics import structural_similarity as ssim
import pytesseract
import easyocr
from PIL import Image
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)


MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["medicloud"]
doctors_col = db["doctors"]
# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------- OCR CONFIG ----------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
reader = easyocr.Reader(['en'], gpu=False)

# ---------------- DB CONFIG ----------------
db = client["medicloud"]
doctors_col = db["doctors"]

# ==========================================================
# 1️⃣ IMAGE PREPROCESSING
# ==========================================================
def preprocess_image(path):
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)

    thr = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 5
    )

    out_path = os.path.join(OUTPUT_DIR, "preprocessed.jpg")
    cv2.imwrite(out_path, thr)
    return out_path

# ==========================================================
# 2️⃣ OCR
# ==========================================================
def extract_text(path):
    easy_text = " ".join(reader.readtext(path, detail=0, paragraph=True))
    tess_text = pytesseract.image_to_string(
        Image.open(path),
        config="--psm 6"
    )
    return easy_text if len(easy_text) > len(tess_text) else tess_text

def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s/-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

# ==========================================================
# 3️⃣ MEDICAL RULES (WITH CONFIDENCE)
# ==========================================================
def rule(pattern, text):
    m = re.search(pattern, text)
    return {
        "present": bool(m),
        "confidence": 90 if m else 0,
        "matched": m.group() if m else None
    }

def medical_rules(text):
    t = normalize_text(text)
    return {
        "doctor": rule(r'\b(dr|doctor)\b', t),
        "reg_no": rule(r'(mci|reg)\s*\w+', t),
        "medicine": rule(r'(tab|cap|syrup|inj|mg|tablet)', t),
        "date": rule(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', t)
    }

# ==========================================================
# 4️⃣ SIGNATURE EXTRACTION
# ==========================================================
def extract_signature(path):
    img = cv2.imread(path)
    h, w = img.shape[:2]

    roi = img[int(h * 0.65):h, 0:w]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, th = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY_INV)

    ink = cv2.countNonZero(th)
    if ink < 300:
        return None

    out_path = os.path.join(OUTPUT_DIR, "signature.jpg")
    cv2.imwrite(out_path, roi)
    return out_path

# ==========================================================
# 5️⃣ SIGNATURE MATCHING (DB CHECK)
# ==========================================================
def match_signature(sig_path, doctor_id):
    doctor = doctors_col.find_one({"doctor_id": doctor_id})
    if not doctor or "signature_path" not in doctor:
        return {"match": False, "confidence": 0}

    db_sig = cv2.imread(doctor["signature_path"], 0)
    up_sig = cv2.imread(sig_path, 0)

    if db_sig is None or up_sig is None:
        return {"match": False, "confidence": 0}

    db_sig = cv2.resize(db_sig, (300, 100))
    up_sig = cv2.resize(up_sig, (300, 100))

    score = ssim(db_sig, up_sig)
    confidence = int(score * 100)

    return {
        "match": confidence > 40,
        "confidence": confidence
    }

# ==========================================================
# 6️⃣ LAYOUT CHECK
# ==========================================================
def layout_check(ref_path, upload_path):
    if not os.path.exists(ref_path):
        return 0

    a = cv2.imread(ref_path, 0)
    b = cv2.imread(upload_path, 0)

    a = cv2.resize(a, (600, 800))
    b = cv2.resize(b, (600, 800))

    return int(ssim(a, b) * 100)

# ==========================================================
# 7️⃣ CORE VERIFICATION PIPELINE
# ==========================================================
def verify_prescription(image_path, doctor_id):
    preprocessed = preprocess_image(image_path)
    text = extract_text(preprocessed)

    rules = medical_rules(text)
    sig_crop = extract_signature(preprocessed)
    sig_result = (
        match_signature(sig_crop, doctor_id)
        if sig_crop else {"match": False, "confidence": 0}
    )

    layout_score = layout_check(
        os.path.join(UPLOAD_DIR, "template.jpg"),
        preprocessed
    )

    total_score = int(
     (sum(v["confidence"] for v in rules.values())
     + sig_result["confidence"]
     + layout_score)
    / (len(rules) + 2)
    )


    status = (
        "VERIFIED" if total_score >= 80
        else "PARTIAL" if total_score >= 55
        else "FAILED"
    )

    return {
        "status": status,
        "overall_score": total_score,
        "checks": rules,
        "signature": sig_result,
        "layout_score": layout_score,
        "preprocessed_image": preprocessed,
        "signature_image": sig_crop
    }

# ==========================================================
# 8️⃣ API ENDPOINT
# ==========================================================
@app.route("/api/verify-prescription", methods=["POST"])
def verify_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    doctor_id = request.form.get("doctor_id", "DR123")

    save_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(save_path)

    try:
        result = verify_prescription(save_path, doctor_id)

        response = {
            "score": result["overall_score"],
            "status": result["status"],

            "layout_score": result["layout_score"],

            "checks": {
                "doctor": result["checks"]["doctor"],
                "registration": result["checks"]["reg_no"],
                "medicine": result["checks"]["medicine"],
                "date": result["checks"]["date"]
            },

            "signature": {
                "present": result["signature"]["confidence"] > 0,
                "match": result["signature"]["match"],
                "confidence": result["signature"]["confidence"]
            }
        }


        return jsonify(response)

        # result = verify_prescription(save_path, doctor_id)
        # return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=6000,
        debug=True
    )
