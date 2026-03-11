import cv2
import pytesseract
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import re

def process_aadhaar_image(img_path):
    """
    Processes the Aadhaar card image and extracts details like name, DOB, gender, and Aadhaar number.

    Args:
        img_path (str): Path to the Aadhaar card image.

    Returns:
        dict: Extracted details from the Aadhaar card.
    """
    # Read and preprocess the image
    img = cv2.imread(img_path)

    if img is None:
        try:
            pil_img = Image.open(img_path).convert('RGB')
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception as e:
            raise ValueError(f"Could not read image file. Ensure it is a valid image format. ({str(e)})")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    h, w, c = img.shape
    if w > 1200:
        new_w = 1200
        ar = w / h
        new_h = int(new_w / ar)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    def thresholding(image):
        img_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(img_gray, 120, 255, cv2.THRESH_BINARY)
        return thresh

    # OCR the full image so the Aadhaar number at the bottom is never clipped
    full_thresh = thresholding(img)
    full_text = pytesseract.image_to_string(full_thresh, lang='eng+guj')

    # --- Regex patterns ---
    DATE_RE         = re.compile(r'\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b')
    PARTIAL_DATE_RE = re.compile(r'(\d{2}[\/\-]\d{2}[\/\-]\d{1,3})\s*$')
    # Fuzzy DOB label: handles OCR garbling like "D0B", "D08", "DOE", "DOG" etc.
    DOB_LABEL_RE    = re.compile(r'(?:D[O0Q][BGE8]|Date\s+of\s+Birth|Year\s+of\s+Birth|जन्म|જન્મ)', re.IGNORECASE)
    # Lines whose label marks them as non-DOB dates — blank them out before searching
    EXCLUDE_LABEL_RE = re.compile(r'(?:Issue\s+Date|Print\s+Date|Expiry|Valid\s+Till)', re.IGNORECASE)
    gender_pattern  = re.compile(r'\b(Male|Female)\b', re.IGNORECASE)
    aadhar_pattern  = re.compile(r'\b(\d{4}[\s\-]?\d{4}[\s\-]?\d{4})\b')

    gender_match = gender_pattern.search(full_text)
    aadhar_match = aadhar_pattern.search(full_text)

    # --- Pre-process: stitch dates split across line breaks ---
    # e.g. "DOB : 25/11/2"  (line 08)  +  "003"  (line 15)  →  "DOB : 25/11/2003"
    raw_lines = full_text.splitlines()
    skip_indices = set()
    stitched_lines = []
    for i, line in enumerate(raw_lines):
        if i in skip_indices:
            continue
        partial = PARTIAL_DATE_RE.search(line)
        if partial:
            digits_so_far = re.sub(r'\D', '', partial.group(1))
            if len(digits_so_far) < 8:           # year is incomplete
                for j in range(i + 1, min(i + 10, len(raw_lines))):
                    nxt = raw_lines[j].strip()
                    if re.match(r'^\d+$', nxt):
                        line = line.rstrip() + nxt
                        skip_indices.add(j)
                        break
        stitched_lines.append(line)

    # Blank out lines that carry a non-DOB date label (Issue Date, Print Date…)
    dob_search_lines = [
        '' if EXCLUDE_LABEL_RE.search(l) else l
        for l in stitched_lines
    ]
    dob_search_text = '\n'.join(dob_search_lines)
    lines = stitched_lines        # use stitched lines everywhere else

    # --- DOB extraction (3-pass on stitched, filtered text) ---
    dob_value = "DOB not found"

    # Pass 1: DOB label and complete date on the same line
    for line in dob_search_text.splitlines():
        if DOB_LABEL_RE.search(line):
            m = DATE_RE.search(line)
            if m:
                dob_value = m.group(1)
                break

    # Pass 2: DOB label on one line, date on the next few lines
    if dob_value == "DOB not found":
        search_lines = dob_search_text.splitlines()
        for i, line in enumerate(search_lines):
            if DOB_LABEL_RE.search(line):
                for j in range(i + 1, min(i + 4, len(search_lines))):
                    m = DATE_RE.search(search_lines[j])
                    if m:
                        dob_value = m.group(1)
                        break
                if dob_value != "DOB not found":
                    break

    # Pass 3: no label reliably found — pick the date with the smallest year
    # (DOB year is always earlier than issue/print date year)
    if dob_value == "DOB not found":
        date_matches = list(DATE_RE.finditer(dob_search_text))
        if date_matches:
            label_positions = [m.start() for m in DOB_LABEL_RE.finditer(dob_search_text)]
            if label_positions:
                best = min(date_matches,
                           key=lambda m: min(abs(m.start() - p) for p in label_positions))
                dob_value = best.group(1)
            else:
                best = min(date_matches,
                           key=lambda m: int(m.group(1).replace('-', '/').split('/')[-1]))
                dob_value = best.group(1)

    # --- Name extraction ---
    SKIP_PATTERNS = re.compile(
        r'government|india|aadhaar|uid|dob|date|birth|male|female|'
        r'\d{4}[\s\-]?\d{4}|help|www\.|toll|free|enrol|valid|unique|authority',
        re.IGNORECASE
    )
    name = "Name not found"
    for line in lines:
        line = line.strip()
        ascii_letters = re.sub(r'[^A-Za-z ]', '', line)
        has_non_ascii = bool(re.search(r'[^\x00-\x7F]', line))
        if (len(ascii_letters.strip()) >= 3
                and not has_non_ascii
                and not SKIP_PATTERNS.search(line)):
            name = line
            break

    # Normalise Aadhaar number to "XXXX XXXX XXXX" format
    aadhaar_number = "Aadhaar Number not found"
    if aadhar_match:
        digits = re.sub(r'\D', '', aadhar_match.group(1))
        aadhaar_number = f"{digits[:4]} {digits[4:8]} {digits[8:12]}"

    result = {
        "name": name,
        "date_of_birth": dob_value,
        "gender": gender_match.group(1).capitalize() if gender_match else "Gender not found",
        "aadhaar_number": aadhaar_number,
    }

    return result
