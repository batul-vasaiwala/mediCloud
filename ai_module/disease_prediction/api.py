from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from .trend_service import (
    generate_heart_trend,
    generate_live_trend,
    top_disease_prediction
)
from .diabetes_service import predict_diabetes_risk
from .trend_service import generate_diabetes_trend
from .medication_trend_service import (
    medication_demand_trend,
    medication_next_month_prediction
)
from .ai_summary_service import generate_ai_summary

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# ----------------------------------
# CORS
# ----------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# MONGO (DEBUG ONLY)
# ----------------------------------
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["medicloud"]
prescriptions = db["prescriptions"]

# ----------------------------------
# ROUTES
# ----------------------------------

@app.get("/api/heart-trend")
def heart_trend():
    return generate_heart_trend()

@app.get("/api/diagnosis-trend/{diagnosis}")
def diagnosis_trend(diagnosis: str):
    return generate_live_trend(diagnosis)

@app.get("/api/top-diseases")
def top_diseases():
    return top_disease_prediction()

@app.post("/api/diabetes-risk")
def diabetes_risk(payload: dict):
    return {
        "diabetes_risk_percent": predict_diabetes_risk(payload)
    }

@app.get("/api/diabetes-trend")
def diabetes_trend():
    return generate_diabetes_trend()


@app.get("/api/medication-demand/trend")
def get_medication_trend():
    return medication_demand_trend()


@app.get("/api/medication-demand/prediction")
def get_medication_prediction():
    return medication_next_month_prediction()

@app.get("/api/ai-summary")
def ai_summary():
    heart = generate_heart_trend()
    diabetes = generate_diabetes_trend()
    medication = medication_next_month_prediction()
    top_diseases = top_disease_prediction()

    return generate_ai_summary(
        heart,
        diabetes,
        medication,
        top_diseases
    )
# ----------------------------------
# DEBUG ROUTE (VERY IMPORTANT)
# ----------------------------------
@app.get("/api/debug")
def debug():
    return {
        "total_docs": prescriptions.count_documents({}),
        "distinct_diagnosis": prescriptions.distinct("diagnosis"),
        "sample_docs": list(
            prescriptions.find({}, {"_id": 0}).limit(3)
        )
    }
