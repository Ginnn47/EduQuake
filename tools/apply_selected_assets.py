from __future__ import annotations

import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SELECTION_FILE = ROOT / "tools" / "selected_game_assets.json"
OUTPUT_DIR = ROOT / "frontend" / "public" / "game" / "assets" / "objects" / "classroom"
REPORT_FILE = OUTPUT_DIR / "selected_assets_report.json"

ROLES = [
    "floor_tile",
    "wall_tile",
    "chalkboard",
    "window",
    "door",
    "desk",
    "chair",
    "teacher_desk",
    "cabinet",
    "bookshelf",
    "poster",
    "plant",
    "trash_bin",
    "debris",
    "crack",
    "warning_icon",
    "safe_marker",
    "exit_marker",
]


def source_path_from_selection(path_value: str | None) -> Path | None:
    if not path_value:
        return None

    source = (ROOT / path_value).resolve()
    root = ROOT.resolve()

    try:
        source.relative_to(root)
    except ValueError:
        raise ValueError(f"Selection points outside project root: {path_value}")

    return source


def apply_selected_assets() -> list[dict[str, str]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not SELECTION_FILE.exists():
        print(f"WARNING: Missing selection file: {SELECTION_FILE}")
        selection: dict[str, str] = {}
    else:
        with SELECTION_FILE.open(encoding="utf-8") as file:
            selection = json.load(file)

    report = []

    for role in ROLES:
        source_value = selection.get(role)
        output = OUTPUT_DIR / f"{role}.png"
        record = {
            "role": role,
            "sourcePath": source_value or "",
            "outputPath": str(output.relative_to(ROOT)).replace("\\", "/"),
            "status": "missing",
        }

        if not source_value:
            print(f"WARNING: Role not selected: {role}")
            report.append(record)
            continue

        source = source_path_from_selection(source_value)
        if source is None or not source.exists():
            print(f"WARNING: Source missing for {role}: {source_value}")
            report.append(record)
            continue

        shutil.copy2(source, output)
        record["status"] = "copied"
        report.append(record)

    with REPORT_FILE.open("w", encoding="utf-8") as file:
        json.dump(report, file, indent=2)

    return report


if __name__ == "__main__":
    result = apply_selected_assets()
    copied = sum(1 for item in result if item["status"] == "copied")
    missing = sum(1 for item in result if item["status"] == "missing")
    print(
        json.dumps(
            {
                "selectionFile": str(SELECTION_FILE.relative_to(ROOT)).replace("\\", "/"),
                "outputDir": str(OUTPUT_DIR.relative_to(ROOT)).replace("\\", "/"),
                "report": str(REPORT_FILE.relative_to(ROOT)).replace("\\", "/"),
                "copied": copied,
                "missing": missing,
            },
            indent=2,
        )
    )
