def calculate_score(ocr_conf, rules, signature, layout):
    score = 0

    # OCR
    score += int(ocr_conf * 20)

    # Rules
    score += 20 if rules.get("doctor") else 0
    score += 20 if rules.get("reg_no") else 0
    score += 15 if rules.get("medicine") else 0
    score += 5 if rules.get("date") else 0

    # Signature
    score += 10 if signature else 0

    # Layout (NEW)
    if all(layout.values()):
        score += 10
    else:
        score += 5  # partial layout

    return score
