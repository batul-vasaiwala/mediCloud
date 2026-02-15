import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# LOAD DATA
df = pd.read_csv("data/diabetes_prediction_dataset.csv")

# DROP USELESS COLUMN IF PRESENT
if "patient_id" in df.columns:
    df = df.drop(columns=["patient_id"])

# ENCODE CATEGORICAL COLUMNS
df["gender"] = df["gender"].map({"Male": 1, "Female": 0})

df["smoking_history"] = df["smoking_history"].map({
    "never": 0,
    "No Info": 0,
    "current": 1,
    "former": 1,
    "ever": 1,
    "not current": 0
})

# DROP NULLS AFTER ENCODING
df = df.dropna()

# FEATURES & TARGET
X = df.drop("diabetes", axis=1)
y = df["diabetes"]

# SCALE
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# MODEL
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# EVALUATE
acc = accuracy_score(y_test, model.predict(X_test))
print("✅ Diabetes Model Accuracy:", acc)

# SAVE MODEL + SCALER
with open("model/diabetes_model.pkl", "wb") as f:
    pickle.dump((model, scaler), f)
