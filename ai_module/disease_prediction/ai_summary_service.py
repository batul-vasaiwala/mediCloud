def generate_ai_summary(
    heart,
    diabetes,
    medication,
    top_diseases
):
    summary = []

    # HEART
    if heart.get("trend") == "increasing":
        summary.append(
            "Heart disease cases are showing an upward trend, indicating growing risk."
        )

    # DIABETES
    if diabetes.get("cases") and diabetes.get("next_month_prediction", 0) > diabetes["cases"][-1]:
        summary.append(
            "Diabetes cases are expected to increase in the coming month."
        )

    # MEDICATION 
    if medication and len(medication) > 0:
        top_med = medication[0]["medicine"]
        summary.append(
            f"Medication demand for {top_med} is expected to rise next month."
        )

    # TOP DISEASE
    if top_diseases and len(top_diseases) > 0:
        summary.append(
            f"{top_diseases[0]['diagnosis'].capitalize()} is currently the highest risk disease."
        )

    return {
        "summary": summary,
        "confidence": min(90, 60 + len(summary) * 5)
    }
