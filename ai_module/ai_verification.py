import os
import cv2
import re
import json
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from skimage.metrics import structural_similarity as ssim
import pytesseract
import easyocr
from PIL import Image
from dotenv import load_dotenv

# ======================================================
# 🔧 BASIC SETUP
# ======================================================
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- LOGGING ----------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------- OCR ----------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
reader = easyocr.Reader(['en'], gpu=False)

# ---------------- DB ----------------
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["medicloud"]
doctors_col = db["doctors"]

# ======================================================
# 🧠 UTILS (CRITICAL FIX)
# ======================================================
def safe_mean(arr, default=0):
    if arr is None or len(arr) == 0:
        logger.warning("⚠ Empty array detected, mean defaulted to 0")
        return default
    return float(np.mean(arr))

# ======================================================
# 🖼 IMAGE PREPROCESSING
# ======================================================
def preprocess_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError("Image not readable")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    thr = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 5
    )

    out_path = os.path.join(OUTPUT_DIR, "preprocessed.jpg")
    cv2.imwrite(out_path, thr)
    return out_path

# ======================================================
# 🔤 OCR (ROBUST)
# ======================================================
def extract_text(path):
    try:
        easy_text = " ".join(reader.readtext(path, detail=0, paragraph=True))
    except:
        easy_text = ""

    try:
        tess_text = pytesseract.image_to_string(
            Image.open(path),
            config="--psm 6"
        )
    except:
        tess_text = ""

    text = easy_text if len(easy_text) > len(tess_text) else tess_text
    return text.strip()

def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s/-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

# ======================================================
# 🧾 MEDICAL RULE ENGINE
# ======================================================
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
        "doctor": rule(r'\b(dr|doctor)\s+[a-z]+\b', t),
        "reg_no": rule(r'(mci|reg|license)\s*\w+', t),
        "medicine": rule(r'(tab|cap|syrup|inj|mg|tablet)', t),
        "date": rule(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', t)
    }

# ======================================================
# ✍ SIGNATURE DETECTION
# ======================================================
def extract_signature(path):
    img = cv2.imread(path)
    if img is None:
        return None

    h, w = img.shape[:2]
    roi = img[int(h * 0.65):h, 0:w]

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, th = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    ink = cv2.countNonZero(th)
    if ink < 500:
        logger.info("No signature detected (ink too low)")
        return None

    out_path = os.path.join(OUTPUT_DIR, "signature.jpg")
    cv2.imwrite(out_path, roi)
    return out_path

# ======================================================
# 🔍 SIGNATURE MATCHING
# ======================================================
def match_signature(sig_path, doctor_license):
    logger.info(f"Searching doctor with license: {doctor_license}")

    doctor = doctors_col.find_one({"license": doctor_license})

    if not doctor:
        logger.warning("Doctor not found in DB")
        return {"match": False, "confidence": 0}

    sig_db_path = doctor.get("signatureUrl")
    if not sig_db_path:
        logger.warning("Doctor signature missing in DB")
        return {"match": False, "confidence": 0}

    sig_db_path = sig_db_path.replace("\\", "/")
    sig_db_path = os.path.join(BASE_DIR, sig_db_path)

    db_sig = cv2.imread(sig_db_path, 0)
    up_sig = cv2.imread(sig_path, 0)

    if db_sig is None or up_sig is None:
        logger.warning("Signature image could not be loaded")
        return {"match": False, "confidence": 0}

    db_sig = cv2.resize(db_sig, (300, 120))
    up_sig = cv2.resize(up_sig, (300, 120))

    score = ssim(db_sig, up_sig)
    confidence = int(score * 100)

    logger.info(f"Signature match confidence: {confidence}")

    return {
        "match": confidence >= 50,
        "confidence": confidence
    }

# ======================================================
# 📐 LAYOUT CHECK
# ======================================================
def layout_check(ref_path, upload_path):
    if not os.path.exists(ref_path):
        return 0

    a = cv2.imread(ref_path, 0)
    b = cv2.imread(upload_path, 0)

    if a is None or b is None:
        return 0

    a = cv2.resize(a, (600, 800))
    b = cv2.resize(b, (600, 800))

    return int(ssim(a, b) * 100)

# ======================================================
# 🧠 CORE VERIFICATION
# ======================================================
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

    rule_scores = [v["confidence"] for v in rules.values()]
    total_score = safe_mean(
        rule_scores + [sig_result["confidence"], layout_score]
    )

    status = (
        "VERIFIED" if total_score >= 80
        else "PARTIAL" if total_score >= 55
        else "FAILED"
    )

    logger.info(f"Verification complete | Score: {total_score} | Status: {status}")

    return {
        "status": status,
        "overall_score": int(total_score),
        "checks": rules,
        "signature": sig_result,
        "layout_score": layout_score
    }

# ======================================================
# 🚀 API ENDPOINT
# ======================================================
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
        return jsonify(result)
    except Exception as e:
        logger.exception("Verification failed")
        return jsonify({"error": str(e)}), 500

# ======================================================
# ▶ RUN
# ======================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
