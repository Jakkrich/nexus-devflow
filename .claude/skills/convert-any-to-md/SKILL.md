---
name: convert-any-to-md
description: "[devflow] Converts any document (.xlsx, .pdf, .docx, .txt, .csv, .log, .json, .yaml, etc.) or mixed folders into clean Markdown in devflow/reference. Use whenever documents need to be analyzed, summarized, searched, or extracted from."
---

# Convert Any Document to Markdown

## When to use this skill

Trigger this skill any time there is a document (`.xlsx`, `.pdf`, `.docx`, `.txt`, `.csv`, `.log`, `.json`, `.yaml`, etc.) or a folder of documents that needs to be analyzed, summarized, reviewed, or extracted from.

Instead of parsing complex binary XML formats (`.docx`, `.xlsx`) or print layouts (`.pdf`) directly, this skill automatically detects the file type, extracts embedded text and images, and outputs standardized Markdown into **`devflow/reference/`** (or a specified output path).

Use this skill for:
- Single files: `.xlsx`, `.pdf`, `.docx`, `.txt`, `.csv`, `.log`, `.json`, `.yaml`, etc.
- Folder batch mode: A directory containing a mix of multiple file types.

## Setup (once per environment)

Before the first conversion in a given environment, follow [`references/setup.md`](references/setup.md) to ensure Python, `markitdown`, `pymupdf`, and `openpyxl` are installed:

```powershell
python -m pip install -r .agents/skills/convert-any-to-md/scripts/requirements.txt
```

## Usage

The conversion script lives at `.agents/skills/convert-any-to-md/scripts/convert_any_to_md.py`.

### Default Destination (`devflow/reference/`)

By default, all converted Markdown files and extracted image folders (`img/`) are placed inside **`devflow/reference/`**:

```powershell
python .agents/skills/convert-any-to-md/scripts/convert_any_to_md.py "C:\path\to\document.pdf"
```

Output:
```text
devflow/reference/
└── document/
    ├── img/
    │   ├── page001_img001.png
    │   └── ...
    └── document.md
```

### Specifying Custom Output Destination (`-o`)

To direct output to a specific folder:

```powershell
python .agents/skills/convert-any-to-md/scripts/convert_any_to_md.py "C:\path\to\document.docx" -o "C:\custom\path"
```

### Folder Batch Mode (`--recursive`)

To convert an entire folder (including mixed file types):

```powershell
python .agents/skills/convert-any-to-md/scripts/convert_any_to_md.py "C:\path\to\documents_folder"
```

Add `--recursive` to scan subdirectories:

```powershell
python .agents/skills/convert-any-to-md/scripts/convert_any_to_md.py "C:\path\to\documents_folder" --recursive
```

## Format Support & Behavior

| Format | Handler | Image Extraction | Output Structure |
| :--- | :--- | :--- | :--- |
| `.xlsx` | MarkItDown + OpenPyXL | Extracts sheet embedded images | `<name>/<name>.md` + `img/` |
| `.pdf` | MarkItDown + PyMuPDF | Extracts page images into appendix | `<name>/<name>.md` + `img/` |
| `.docx` | MarkItDown + ZIP Media | Extracts word media images | `<name>/<name>.md` + `img/` |
| `.txt`, `.csv`, `.json`, `.yaml`, `.log` | Plaintext Formatter | N/A | `<name>/<name>.md` |

> [!NOTE]
> Legacy binary formats (`.xls`, `.doc`) are not supported directly. Ask the user to re-save them as `.xlsx` / `.docx` first.