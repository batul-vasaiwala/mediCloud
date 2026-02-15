from collections import Counter
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
# -------------------------

# Mongo Connection (LOCAL TO THIS FILE)
# -------------------------
MONGO_URI = "mongodb+srv://batul:batul123@medicloud.oqphpii.mongodb.net/medicloud?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database()
prescriptions = db["prescriptions"]

# -------------------------
# MEDICATION TREND
# -------------------------
def medication_demand_trend():
    docs = list(prescriptions.find())

    counter = Counter()

    for doc in docs:
        for med in doc.get("medicines", []):
            counter[med["name"]] += 1

    return [
        {"medicine": name, "count": count}
        for name, count in counter.items()
    ]


# -------------------------
# NEXT MONTH PREDICTION
# -------------------------
def medication_next_month_prediction():
    docs = list(prescriptions.find())

    counter = Counter()

    for doc in docs:
        for med in doc.get("medicines", []):
            counter[med["name"]] += 1

    return [
        {
            "medicine": name,
            "predicted_next_month": int(count * 1.2)
        }
        for name, count in counter.items()
    ]
