# Environment Setup for convert-any-to-md

Follow these steps to set up the Python dependencies for document conversion.

## 1. Prerequisites

- Python 3.10+
- pip

## 2. Installation

Run:

```powershell
python -m pip install -r .agents/skills/convert-any-to-md/scripts/requirements.txt
```

This installs:
- `markitdown[xlsx]`
- `pymupdf` (for PDF image extraction)
- `openpyxl` (for Excel parsing)

## 3. Verification

```powershell
python -c "from markitdown import MarkItDown; import fitz; import openpyxl; print('Dependencies OK')"
```

Expect `Dependencies OK` to print cleanly.
