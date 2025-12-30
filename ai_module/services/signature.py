import cv2
import numpy as np
import os

SIGNATURE_DB = "signatures/"   # folder containing doctor signatures

def match_signature_db(input_signature):
    orb = cv2.ORB_create()

    kp1, des1 = orb.detectAndCompute(input_signature, None)

    if des1 is None:
        return False, 0

    best_score = 0

    for file in os.listdir(SIGNATURE_DB):
        path = os.path.join(SIGNATURE_DB, file)

        db_img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        db_img = cv2.resize(db_img, (300, 150))

        kp2, des2 = orb.detectAndCompute(db_img, None)
        if des2 is None:
            continue

        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)

        score = len(matches)
        best_score = max(best_score, score)

    confidence = min(int(best_score * 2), 100)

    return best_score > 25, confidence

def detect_signature(image_path):
    img = cv2.imread(image_path)
    h, w, _ = img.shape

    # 1️⃣ Crop bottom area
    bottom = img[int(h * 0.7):h, 0:w]
    gray = cv2.cvtColor(bottom, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(
        gray, 120, 255, cv2.THRESH_BINARY_INV
    )

    ink_pixels = cv2.countNonZero(thresh)

    if ink_pixels < 800:
        return {
            "present": False,
            "db_match": False,
            "confidence": 0
        }

    # 2️⃣ Extract signature image
    signature_crop = preprocess_signature(thresh)

    # 3️⃣ Match with DB
    match, confidence = match_signature_db(signature_crop)

    return {
        "present": True,
        "db_match": match,
        "confidence": confidence
    }


def preprocess_signature(img):
    img = cv2.resize(img, (300, 150))
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img
