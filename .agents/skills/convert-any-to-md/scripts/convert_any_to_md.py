#!/usr/bin/env python3
"""Convert any document (.xlsx, .pdf, .docx, .txt, .csv, .log, .json, .yaml, etc.)
or a directory of mixed files into clean Markdown, outputting by default into `devflow/reference/`.

Usage:
    python convert_any_to_md.py <input> [-o OUTPUT] [--recursive]

Arguments:
    <input>        Path to a single document or a directory.
    -o, --output   Target output directory (default: devflow/reference).
    --recursive    Recursively process subdirectories when input is a directory.

Exit codes:
    0 - All requested conversions succeeded
    1 - One or more conversions failed (partial success in batch mode)
    2 - Required dependency missing
    3 - Invalid input path
"""

import argparse
import hashlib
import posixpath
import re
import shutil
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

EXIT_OK = 0
EXIT_CONVERSION_FAILED = 1
EXIT_MISSING_DEPENDENCY = 2
EXIT_INVALID_INPUT = 3

# Namespaces for OOXML
_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
_MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
_R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
_A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"

# MarkItDown placeholder pattern for docx
_PLACEHOLDER_IMAGE_RE = re.compile(
    r'!\[([^\]]*)\]\(data:image/[a-zA-Z0-9.+-]+;base64[^)]*\)'
)

# Sheet header pattern for xlsx
_SHEET_HEADER_RE = re.compile(r"^## (.+)$", re.MULTILINE)

SUPPORTED_TEXT_EXTS = {
    ".txt", ".log", ".csv", ".tsv", ".json", ".yaml", ".yml",
    ".md", ".markdown", ".py", ".js", ".ts", ".html", ".xml", ".css"
}

IGNORE_EXTS = {
    ".exe", ".dll", ".so", ".dylib", ".bin", ".zip", ".tar", ".gz",
    ".7z", ".rar", ".iso", ".pyc", ".class", ".o", ".obj"
}

def get_markitdown():
    """Lazy import MarkItDown if available."""
    try:
        from markitdown import MarkItDown
        return MarkItDown()
    except ImportError:
        return None

# ============================================================================
# Excel Handler
# ============================================================================

def _normalize_rel_path(base_dir: str, target: str) -> str:
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join(base_dir, target))

def _xlsx_sheet_media(xlsx_path: Path):
    try:
        with zipfile.ZipFile(xlsx_path) as z:
            names = set(z.namelist())
            if "xl/workbook.xml" not in names or "xl/_rels/workbook.xml.rels" not in names:
                return {}
            workbook_xml = z.read("xl/workbook.xml")
            workbook_rels_xml = z.read("xl/_rels/workbook.xml.rels")

            sheet_rid = {}
            for sheet_el in ET.fromstring(workbook_xml).iter(f"{{{_MAIN_NS}}}sheet"):
                name = sheet_el.get("name")
                rid = sheet_el.get(f"{{{_R_NS}}}id")
                if name and rid:
                    sheet_rid[name] = rid

            rid_target = {}
            for rel in ET.fromstring(workbook_rels_xml).findall(f"{{{_REL_NS}}}Relationship"):
                rid_target[rel.get("Id")] = rel.get("Target")

            result = {}
            for sheet_name, rid in sheet_rid.items():
                target = rid_target.get(rid)
                if not target:
                    continue
                sheet_path = _normalize_rel_path("xl", target)
                if sheet_path not in names or "/" not in sheet_path:
                    continue
                sheet_dir, sheet_file = sheet_path.rsplit("/", 1)
                sheet_rels_path = f"{sheet_dir}/_rels/{sheet_file}.rels"
                if sheet_rels_path not in names:
                    continue

                drawing_rid = None
                for d in ET.fromstring(z.read(sheet_path)).iter(f"{{{_MAIN_NS}}}drawing"):
                    drawing_rid = d.get(f"{{{_R_NS}}}id")
                    break
                if not drawing_rid:
                    continue

                drawing_target = None
                for rel in ET.fromstring(z.read(sheet_rels_path)).findall(f"{{{_REL_NS}}}Relationship"):
                    if rel.get("Id") == drawing_rid:
                        drawing_target = rel.get("Target")
                        break
                if not drawing_target:
                    continue
                drawing_path = _normalize_rel_path(sheet_dir, drawing_target)
                if drawing_path not in names or "/" not in drawing_path:
                    continue
                drawing_dir, drawing_file = drawing_path.rsplit("/", 1)
                drawing_rels_path = f"{drawing_dir}/_rels/{drawing_file}.rels"
                if drawing_rels_path not in names:
                    continue

                drawing_rel_map = {}
                for rel in ET.fromstring(z.read(drawing_rels_path)).findall(f"{{{_REL_NS}}}Relationship"):
                    drawing_rel_map[rel.get("Id")] = rel.get("Target")

                media_paths = []
                for blip in ET.fromstring(z.read(drawing_path)).iter(f"{{{_A_NS}}}blip"):
                    embed_rid = blip.get(f"{{{_R_NS}}}embed")
                    if not embed_rid:
                        continue
                    rel_target = drawing_rel_map.get(embed_rid)
                    if not rel_target:
                        continue
                    media_path = _normalize_rel_path(drawing_dir, rel_target)
                    if media_path in names:
                        media_paths.append(media_path)

                if media_paths:
                    result[sheet_name] = media_paths
            return result
    except Exception:
        return {}

def extract_xlsx_images(xlsx_path: Path, img_dir: Path):
    sheet_media = _xlsx_sheet_media(xlsx_path)
    if not sheet_media:
        return {}

    written = {}
    with zipfile.ZipFile(xlsx_path) as z:
        names_in_zip = set(z.namelist())
        for sheet_idx, (sheet_name, media_paths) in enumerate(sheet_media.items(), start=1):
            safe_name = re.sub(r"[^A-Za-z0-9_.-]+", "_", sheet_name).strip("_") or "sheet"
            safe_prefix = f"sheet{sheet_idx:03d}_{safe_name}"
            files = []
            for idx, media_path in enumerate(media_paths, start=1):
                if media_path not in names_in_zip:
                    continue
                ext = Path(media_path).suffix.lstrip(".").lower() or "bin"
                if ext == "jpg":
                    ext = "jpeg"
                fname = f"{safe_prefix}_img{idx:03d}.{ext}"
                dest = img_dir / fname
                img_dir.mkdir(parents=True, exist_ok=True)
                with z.open(media_path) as src, open(dest, "wb") as dst:
                    shutil.copyfileobj(src, dst)
                files.append(fname)
            if files:
                written[sheet_name] = files
    return written

def convert_excel(file_path: Path, out_dir: Path, md_engine) -> bool:
    img_dir = out_dir / "img"
    sheet_images = extract_xlsx_images(file_path, img_dir)
    
    if md_engine:
        res = md_engine.convert(str(file_path))
        text = res.text_content
    else:
        text = f"# {file_path.stem}\n\n*(MarkItDown engine not available. Basic conversion applied)*\n"

    if sheet_images:
        matches = list(_SHEET_HEADER_RE.finditer(text))
        if matches:
            parts = []
            last_end = 0
            for i, m in enumerate(matches):
                sheet_name = m.group(1).strip()
                next_start = matches[i + 1].start() if i + 1 < len(matches) else len(text)
                section = text[last_end:next_start]
                last_end = next_start

                if sheet_name in sheet_images:
                    img_lines = ["\n\n#### Images in this sheet\n"]
                    for fname in sheet_images[sheet_name]:
                        img_lines.append(f"![{sheet_name} image](img/{fname})\n")
                    section = section.rstrip() + "\n" + "".join(img_lines)
                parts.append(section)
            text = "".join(parts)

    out_md = out_dir / f"{file_path.stem}.md"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_md.write_text(text, encoding="utf-8")
    return True

# ============================================================================
# PDF Handler
# ============================================================================

def extract_pdf_images(pdf_path: Path, img_dir: Path):
    try:
        import fitz
    except ImportError:
        return {}

    written_by_page = {}
    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return written_by_page

    try:
        for page_index in range(len(doc)):
            page = doc[page_index]
            page_label = page_index + 1
            raw_images = []
            try:
                xobjects = page.get_images(full=True)
            except Exception:
                xobjects = []

            for img in xobjects:
                xref = img[0]
                try:
                    base_image = doc.extract_image(xref)
                except Exception:
                    continue
                img_bytes = base_image.get("image") or b""
                if not img_bytes:
                    continue
                ext = (base_image.get("ext") or "png").lower()
                raw_images.append((img_bytes, ext))

            if not raw_images:
                continue

            saved_files = []
            img_dir.mkdir(parents=True, exist_ok=True)
            for idx, (img_bytes, ext) in enumerate(raw_images, start=1):
                fname = f"page{page_label:03d}_img{idx:03d}.{ext}"
                dest = img_dir / fname
                dest.write_bytes(img_bytes)
                saved_files.append(fname)

            if saved_files:
                written_by_page[page_label] = saved_files
    finally:
        doc.close()
    return written_by_page

def convert_pdf(file_path: Path, out_dir: Path, md_engine) -> bool:
    img_dir = out_dir / "img"
    page_images = extract_pdf_images(file_path, img_dir)

    if md_engine:
        res = md_engine.convert(str(file_path))
        text = res.text_content
    else:
        text = f"# {file_path.stem}\n\n*(MarkItDown engine not available)*\n"

    if page_images:
        appendix = ["\n\n## Extracted Images\n"]
        for page_num in sorted(page_images.keys()):
            appendix.append(f"\n### Page {page_num}\n")
            for fname in page_images[page_num]:
                appendix.append(f"![Page {page_num} image](img/{fname})\n")
        text = text.rstrip() + "".join(appendix)

    out_md = out_dir / f"{file_path.stem}.md"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_md.write_text(text, encoding="utf-8")
    return True

# ============================================================================
# Word Handler
# ============================================================================

def _word_ordered_media(docx_path: Path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            if "word/document.xml" not in z.namelist() or "word/_rels/document.xml.rels" not in z.namelist():
                return []
            rels_xml = z.read("word/_rels/document.xml.rels")
            doc_xml = z.read("word/document.xml")
    except Exception:
        return []

    try:
        rels_root = ET.fromstring(rels_xml)
        doc_root = ET.fromstring(doc_xml)
    except Exception:
        return []

    rel_map = {rel.get("Id"): rel.get("Target") for rel in rels_root.findall(f"{{{_REL_NS}}}Relationship")}
    ordered_rel_ids = []
    for elem in doc_root.iter():
        tag = elem.tag.rsplit("}", 1)[-1]
        rid = elem.get(f"{{{_R_NS}}}embed") if tag == "blip" else (elem.get(f"{{{_R_NS}}}id") if tag == "imagedata" else None)
        if rid:
            ordered_rel_ids.append(rid)

    ordered_media = []
    for rid in ordered_rel_ids:
        target = rel_map.get(rid)
        if not target or "media/" not in target:
            continue
        media_path = target.lstrip("/") if target.startswith("/") else posixpath.normpath(target if target.startswith("word/") else posixpath.join("word", target))
        ordered_media.append((rid, media_path))
    return ordered_media

def extract_word_images(docx_path: Path, img_dir: Path):
    ordered_media = _word_ordered_media(docx_path)
    if not ordered_media:
        return []

    written = []
    with zipfile.ZipFile(docx_path) as z:
        names_in_zip = set(z.namelist())
        for idx, (rid, media_path) in enumerate(ordered_media, start=1):
            if media_path not in names_in_zip:
                continue
            ext = Path(media_path).suffix.lstrip(".").lower() or "bin"
            if ext == "jpg":
                ext = "jpeg"
            fname = f"img{idx:03d}.{ext}"
            dest = img_dir / fname
            img_dir.mkdir(parents=True, exist_ok=True)
            with z.open(media_path) as src, open(dest, "wb") as dst:
                shutil.copyfileobj(src, dst)
            written.append(fname)
    return written

def convert_word(file_path: Path, out_dir: Path, md_engine) -> bool:
    img_dir = out_dir / "img"
    images = extract_word_images(file_path, img_dir)

    if md_engine:
        res = md_engine.convert(str(file_path))
        text = res.text_content
    else:
        text = f"# {file_path.stem}\n\n*(MarkItDown engine not available)*\n"

    if images:
        img_idx = 0
        def replace_img(match):
            nonlocal img_idx
            alt_text = match.group(1)
            if img_idx < len(images):
                fname = images[img_idx]
                img_idx += 1
                return f"![{alt_text}](img/{fname})"
            return match.group(0)

        text = _PLACEHOLDER_IMAGE_RE.sub(replace_img, text)

    out_md = out_dir / f"{file_path.stem}.md"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_md.write_text(text, encoding="utf-8")
    return True

# ============================================================================
# Plaintext Handler
# ============================================================================

def convert_text(file_path: Path, out_dir: Path) -> bool:
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        print(f"ERROR reading {file_path}: {exc}", file=sys.stderr)
        return False

    ext = file_path.suffix.lower()
    if ext in {".md", ".markdown"}:
        md_text = content
    else:
        lang_map = {
            ".py": "python", ".js": "javascript", ".ts": "typescript",
            ".json": "json", ".yaml": "yaml", ".yml": "yaml",
            ".html": "html", ".xml": "xml", ".css": "css", ".csv": "csv"
        }
        lang = lang_map.get(ext, "")
        if lang:
            md_text = f"# {file_path.name}\n\n```{lang}\n{content}\n```\n"
        else:
            md_text = f"# {file_path.name}\n\n{content}\n"

    out_md = out_dir / f"{file_path.stem}.md"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_md.write_text(md_text, encoding="utf-8")
    return True

# ============================================================================
# Main Router
# ============================================================================

def convert_single_file(file_path: Path, base_out_dir: Path, md_engine) -> bool:
    ext = file_path.suffix.lower()
    out_dir = base_out_dir / file_path.stem

    if ext in IGNORE_EXTS:
        return True

    print(f"Converting [{ext or 'text'}] {file_path.name} -> {out_dir}")

    if ext == ".xlsx":
        return convert_excel(file_path, out_dir, md_engine)
    elif ext == ".pdf":
        return convert_pdf(file_path, out_dir, md_engine)
    elif ext == ".docx":
        return convert_word(file_path, out_dir, md_engine)
    elif ext in SUPPORTED_TEXT_EXTS or ext == "":
        return convert_text(file_path, out_dir)
    else:
        # Fallback to text conversion for unknown extensions
        return convert_text(file_path, out_dir)

def main():
    parser = argparse.ArgumentParser(
        description="Convert documents to Markdown and save to devflow/reference/"
    )
    parser.add_argument("input", help="Path to a file or directory to convert")
    parser.add_argument(
        "-o", "--output",
        default="devflow/reference",
        help="Target output directory (default: devflow/reference)"
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Recursively process subdirectories"
    )

    args = parser.parse_args()
    input_path = Path(args.input).resolve()
    base_out_dir = Path(args.output).resolve()

    if not input_path.exists():
        print(f"ERROR: Input path not found: {input_path}", file=sys.stderr)
        sys.exit(EXIT_INVALID_INPUT)

    md_engine = get_markitdown()

    if input_path.is_file():
        success = convert_single_file(input_path, base_out_dir, md_engine)
        sys.exit(EXIT_OK if success else EXIT_CONVERSION_FAILED)
    elif input_path.is_dir():
        pattern = "**/*" if args.recursive else "*"
        files = [p for p in input_path.glob(pattern) if p.is_file()]
        
        if not files:
            print(f"No files found in {input_path}")
            sys.exit(EXIT_OK)

        success_count = 0
        fail_count = 0
        for f in files:
            if f.suffix.lower() in IGNORE_EXTS:
                continue
            if convert_single_file(f, base_out_dir, md_engine):
                success_count += 1
            else:
                fail_count += 1

        print(f"\nBatch summary: {success_count} succeeded, {fail_count} failed.")
        sys.exit(EXIT_OK if fail_count == 0 else EXIT_CONVERSION_FAILED)

if __name__ == "__main__":
    main()
