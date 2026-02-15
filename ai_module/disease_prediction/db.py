from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()  # LOAD ONCE, GLOBALLY

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in environment")

client = MongoClient(MONGO_URI)
db = client["medicloud"]
prescriptions = db["prescriptions"]
