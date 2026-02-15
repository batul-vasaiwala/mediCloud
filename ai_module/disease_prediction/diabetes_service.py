import pickle
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "diabetes_model.pkl")

with open(MODEL_PATH, "rb") as f:
    model, scaler = pickle.load(f)

def predict_diabetes_risk(payload: dict):
    X = np.array([[
        payload["gender"],
        payload["age"],
        payload["hypertension"],
        payload["heart_disease"],
        payload["bmi"],
        payload["HbA1c_level"],
        payload["blood_glucose_level"],
        payload["smoking_history"]
    ]])

    X = scaler.transform(X)
    risk = model.predict_proba(X)[0][1]

    return round(float(risk) * 100, 2)
