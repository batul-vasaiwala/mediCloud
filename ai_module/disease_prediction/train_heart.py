import os
import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# --------------------------------------------------
# 1. LOAD DATASET (SAFE PATH HANDLING)
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "heart_disease_uci.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model", "heart_disease_model.pkl")

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully")
print(df.head())

# --------------------------------------------------
# 2. ENCODE CATEGORICAL COLUMNS
# --------------------------------------------------

categorical_cols = df.select_dtypes(include="object").columns

le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col].astype(str))

print("\nCategorical columns encoded")

# --------------------------------------------------
# 3. HANDLE MISSING VALUES
# --------------------------------------------------

df = df.dropna()

print("Missing values handled")
print("Dataset shape after cleaning:", df.shape)

# --------------------------------------------------
# 4. CREATE TARGET VARIABLE (BINARY)
# --------------------------------------------------
# num = 0 -> No disease
# num > 0 -> Disease present

df["target"] = df["num"].apply(lambda x: 0 if x == 0 else 1)

# --------------------------------------------------
# 5. FEATURE SELECTION
# --------------------------------------------------

features = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalch",
    "exang",
    "oldpeak"
]

X = df[features]
y = df["target"]

print("\nFeatures and target prepared")

# --------------------------------------------------
# 6. TRAIN-TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --------------------------------------------------
# 7. TRAIN MODEL (SAFE & EXAM-FRIENDLY)
# --------------------------------------------------

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# --------------------------------------------------
# 8. EVALUATE MODEL
# --------------------------------------------------

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

# --------------------------------------------------
# 9. SAVE MODEL
# --------------------------------------------------

os.makedirs(os.path.join(BASE_DIR, "model"), exist_ok=True)
joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully at:")
print(MODEL_PATH)
