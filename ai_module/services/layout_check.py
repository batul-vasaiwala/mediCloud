import pytesseract
from pytesseract import Output
import cv2

def layout_check(image_path):
    img = cv2.imread(image_path)
    h, w, _ = img.shape

    data = pytesseract.image_to_data(img, output_type=Output.DICT)

    zones = {
        "top": False,
        "middle": False,
        "bottom": False
    }

    for i, text in enumerate(data["text"]):
        if text.strip() == "":
            continue

        y = data["top"][i]

        if y < h * 0.3:
            zones["top"] = True
        elif y < h * 0.7:
            zones["middle"] = True
        else:
            zones["bottom"] = True

    return zones
