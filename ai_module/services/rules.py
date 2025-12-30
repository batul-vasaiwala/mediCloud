import re

def normalize_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text


def medical_rules(text):
    text = normalize_text(text)

    rules = {
        "doctor": bool(re.search(r'\b(dr\.?|doctor)\b', text)),

        "reg_no": bool(re.search(
            r'(reg\.?\s*no\.?|registration\s*no|mci|licence|license)',
            text
        )),

        "medicine": bool(re.search(
            r'\b(tab|tablet|cap|capsule|syrup|inj|mg|ml)\b',
            text
        )),

        "date": bool(re.search(
            r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',
            text
        ))
    }

    return rules
