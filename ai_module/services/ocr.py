import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text(image_path):
    text = pytesseract.image_to_string(Image.open(image_path))
    confidence = 0.75 if len(text) > 50 else 0.4
    return text, confidence
