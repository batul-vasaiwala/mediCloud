import pandas as pd
import numpy as np
from pymongo import MongoClient
import os
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://batul:batul123@medicloud.oqphpii.mongodb.net/medicloud?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database()   
prescriptions = db["prescriptions"]


# ----------------------------------
# OPTIONAL: HEART DISEASE CSV
# ----------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "heart_disease_uci.csv")

def load_heart_historical_data():
    if not os.path.exists(CSV_PATH):
        return pd.DataFrame(columns=["month", "cases"])

    df = pd.read_csv(CSV_PATH)
    df = df[df["num"] > 0]

    df["month"] = pd.date_range(
        start="2023-01-01",
        periods=len(df),
        freq="D"
    ).to_period("M").astype(str)

    return df.groupby("month").size().reset_index(name="cases")

# ----------------------------------
# LOAD MONGO DATA (ANY DIAGNOSIS)
# ----------------------------------
def load_mongo_data(diagnosis):
    data = list(
        prescriptions.find(
            {"diagnosis": diagnosis},
            {"createdAt": 1, "_id": 0}
        )
    )

    if not data:
        return pd.DataFrame(columns=["month", "cases"])

    df = pd.DataFrame(data)
    df["month"] = pd.to_datetime(df["createdAt"]).dt.to_period("M").astype(str)

    return df.groupby("month").size().reset_index(name="cases")

# ----------------------------------
# AI TREND LOGIC
# ----------------------------------
def forecast_from_cases(cases):
    if len(cases) >= 3:
        diffs = np.diff(cases[-3:])
        avg_change = int(round(np.mean(diffs)))
    elif len(cases) >= 2:
        avg_change = cases[-1] - cases[-2]
    else:
        avg_change = 0

    next_month = max(cases[-1] + avg_change, 0) if cases else 0

    trend = (
        "increasing" if avg_change > 0
        else "decreasing" if avg_change < 0
        else "stable"
    )

    confidence = min(90, 50 + len(cases) * 5)

    return next_month, trend, confidence

# ----------------------------------
# HEART DISEASE (CSV + MONGO)
# ----------------------------------
def generate_heart_trend():
    hist = load_heart_historical_data()
    live = load_mongo_data("heart")

    combined = pd.concat([hist, live], ignore_index=True)
    combined = combined.groupby("month", as_index=False).sum()
    combined = combined.sort_values("month")

    cases = combined["cases"].tolist()
    months = combined["month"].tolist()

    next_month, trend, confidence = forecast_from_cases(cases)

    return {
        "diagnosis": "heart",
        "months": months,
        "cases": cases,
        "next_month_prediction": next_month,
        "trend": trend,
        "confidence": confidence
    }


# ----------------------------------
# DIABETES CSV (KAGGLE DATA)
# ----------------------------------
DIABETES_CSV = os.path.join(BASE_DIR, "data", "diabetes_prediction_dataset.csv")

def load_diabetes_historical_data():
    if not os.path.exists(DIABETES_CSV):
        return pd.DataFrame(columns=["month", "cases"])

    df = pd.read_csv(DIABETES_CSV)

    # consider diabetic cases only
    df = df[df["diabetes"] == 1]

    # FAKE monthly timeline (historical)
    df["month"] = pd.date_range(
        start="2023-01-01",
        periods=len(df),
        freq="D"
    ).to_period("M").astype(str)

    return df.groupby("month").size().reset_index(name="cases")
# ----------------------------------
# DIABETES (CSV + MONGO)
# ----------------------------------
def generate_diabetes_trend():
    hist = load_diabetes_historical_data()
    live = load_mongo_data("diabetes")

    combined = pd.concat([hist, live], ignore_index=True)
    combined = combined.groupby("month", as_index=False).sum()
    combined = combined.sort_values("month")

    cases = combined["cases"].tolist()
    months = combined["month"].tolist()

    next_month, trend, confidence = forecast_from_cases(cases)

    return {
        "diagnosis": "diabetes",
        "months": months,
        "cases": cases,
        "next_month_prediction": next_month,
        "trend": trend,
        "confidence": confidence
    }

# ----------------------------------
# ANY OTHER DISEASE (MONGO ONLY)
# ----------------------------------
def generate_live_trend(diagnosis):
    df = load_mongo_data(diagnosis)

    if df.empty:
        return {
            "diagnosis": diagnosis,
            "months": [],
            "cases": [],
            "next_month_prediction": 0,
            "trend": "stable",
            "confidence": 60
        }

    cases = df["cases"].tolist()
    months = df["month"].tolist()

    next_month, trend, confidence = forecast_from_cases(cases)

    return {
        "diagnosis": diagnosis,
        "months": months,
        "cases": cases,
        "next_month_prediction": next_month,
        "trend": trend,
        "confidence": confidence
    }

# ----------------------------------
# TOP DISEASE PREDICTION (AI RANKING)
# ----------------------------------
def top_disease_prediction(limit=5):
    diagnoses = prescriptions.distinct("diagnosis")
    results = []

    for d in diagnoses:
        data = (
            generate_heart_trend()
            if d == "heart"
            else generate_live_trend(d)
        )

        risk_score = int(
            data["next_month_prediction"] * 0.7 +
            (data["cases"][-1] if data["cases"] else 0) * 0.3
        )

        results.append({
            "diagnosis": d,
            "predicted_cases": data["next_month_prediction"],
            "risk_score": risk_score,
            "trend": data["trend"],
            "confidence": data["confidence"]
        })

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results[:limit]

# ----------------------------------
# DEBUG RUN
# ----------------------------------
if __name__ == "__main__":
    print("\n🔮 TOP AI DISEASE FORECAST\n")
    for d in top_disease_prediction():
        print(d)
