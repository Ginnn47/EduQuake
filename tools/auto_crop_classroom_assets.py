from __future__ import annotations

import json
import math
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "frontend" / "public" / "game" / "assets"
SOURCE_IMAGE = ASSET_ROOT / "source" / "classroom_interior_source.png"
AUTO_DIR = ASSET_ROOT / "objects" / "auto"
TILE_DIR = ASSET_ROOT / "objects" / "tiles"
AUTO_CONTACT_SHEET = ASSET_ROOT / "objects" / "auto_contact_sheet.png"
TILE_CONTACT_SHEET = ASSET_ROOT / "objects" / "tile_contact_sheet.png"
CROP_REPORT = ASSET_ROOT / "objects" / "crop_report.json"

TILE_SIZE = 32
MIN_COMPONENT_AREA = 24
MAX_COMPONENTS = 1200
CONTACT_COLUMNS = 12


def ensure_clean_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    for child in path.iterdir():
        if child.is_file():
            child.unlink()
        elif child.is_dir():
            shutil.rmtree(child)


def has_transparency(image: Image.Image) -> bool:
    if image.mode in {"RGBA", "LA"}:
        alpha = image.getchannel("A")
        minimum, maximum = alpha.getextrema()
        return minimum < 255 and maximum > 0

    if image.mode == "P" and "transparency" in image.info:
        return True

    return False


def is_useful_tile(tile: Image.Image) -> bool:
    rgba = tile.convert("RGBA")
    alpha = rgba.getchannel("A")

    if alpha.getbbox() is None:
        return False

    non_transparent = sum(1 for value in alpha.getdata() if value > 8)
    if non_transparent < 16:
        return False

    sample = rgba.resize((8, 8), Image.Resampling.NEAREST)
    colors = sample.getcolors(maxcolors=128) or []
    opaque_colors = [color for _, color in colors if color[3] > 8]

    if len(set(opaque_colors)) <= 1:
        return False

    return True


def connected_component_crop(image: Image.Image) -> list[dict]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    alpha = rgba.getchannel("A").load()
    visited = bytearray(width * height)
    records: list[dict] = []

    def index(x: int, y: int) -> int:
        return y * width + x

    for y in range(height):
        for x in range(width):
            start_index = index(x, y)
            if visited[start_index] or alpha[x, y] <= 8:
                continue

            queue: deque[tuple[int, int]] = deque([(x, y)])
            visited[start_index] = 1
            min_x = max_x = x
            min_y = max_y = y
            area = 0

            while queue:
                cx, cy = queue.popleft()
                area += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue

                    next_index = index(nx, ny)
                    if visited[next_index] or alpha[nx, ny] <= 8:
                        continue

                    visited[next_index] = 1
                    queue.append((nx, ny))

            if area < MIN_COMPONENT_AREA:
                continue

            crop_box = (min_x, min_y, max_x + 1, max_y + 1)
            cropped = rgba.crop(crop_box)
            name = f"object_{len(records) + 1:03d}.png"
            output_path = AUTO_DIR / name
            cropped.save(output_path)
            records.append(
                {
                    "name": name,
                    "path": f"/game/assets/objects/auto/{name}",
                    "source": SOURCE_IMAGE.name,
                    "x": min_x,
                    "y": min_y,
                    "width": cropped.width,
                    "height": cropped.height,
                    "method": "connected_component",
                }
            )

            if len(records) >= MAX_COMPONENTS:
                return records

    return records


def grid_slice(image: Image.Image) -> list[dict]:
    rgba = image.convert("RGBA")
    records: list[dict] = []
    width, height = rgba.size

    for y in range(0, height - (height % TILE_SIZE), TILE_SIZE):
        for x in range(0, width - (width % TILE_SIZE), TILE_SIZE):
            tile = rgba.crop((x, y, x + TILE_SIZE, y + TILE_SIZE))
            if not is_useful_tile(tile):
                continue

            name = f"tile_{len(records) + 1:04d}.png"
            output_path = TILE_DIR / name
            tile.save(output_path)
            records.append(
                {
                    "name": name,
                    "path": f"/game/assets/objects/tiles/{name}",
                    "source": SOURCE_IMAGE.name,
                    "x": x,
                    "y": y,
                    "width": TILE_SIZE,
                    "height": TILE_SIZE,
                    "method": "grid_32",
                }
            )

    return records


def make_contact_sheet(records: list[dict], output_path: Path, title: str) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()

    if not records:
        sheet = Image.new("RGBA", (520, 96), (24, 20, 16, 255))
        draw = ImageDraw.Draw(sheet)
        draw.text((12, 12), title, fill=(244, 223, 157, 255), font=font)
        draw.text((12, 42), "No crops generated for this method.", fill=(244, 223, 157, 255), font=font)
        sheet.save(output_path)
        return

    thumb_size = 48
    label_height = 14
    padding = 8
    columns = min(CONTACT_COLUMNS, len(records))
    rows = math.ceil(len(records) / columns)
    cell_width = thumb_size + padding
    cell_height = thumb_size + label_height + padding
    header_height = 24
    sheet_width = columns * cell_width + padding
    sheet_height = rows * cell_height + header_height + padding

    sheet = Image.new("RGBA", (sheet_width, sheet_height), (24, 20, 16, 255))
    draw = ImageDraw.Draw(sheet)
    draw.text((padding, 6), title, fill=(244, 223, 157, 255), font=font)

    for index, record in enumerate(records):
        if record["method"] == "connected_component":
            source_file = AUTO_DIR / record["name"]
        else:
            source_file = TILE_DIR / record["name"]

        with Image.open(source_file) as crop_image:
            thumb = crop_image.convert("RGBA")
            thumb.thumbnail((thumb_size, thumb_size), Image.Resampling.NEAREST)

        col = index % columns
        row = index // columns
        cell_x = padding + col * cell_width
        cell_y = header_height + row * cell_height
        image_x = cell_x + (thumb_size - thumb.width) // 2
        image_y = cell_y + (thumb_size - thumb.height) // 2

        sheet.alpha_composite(thumb, (image_x, image_y))
        draw.rectangle((cell_x, cell_y, cell_x + thumb_size, cell_y + thumb_size), outline=(122, 75, 34, 255))
        draw.text((cell_x, cell_y + thumb_size + 2), record["name"].removesuffix(".png"), fill=(244, 223, 157, 255), font=font)

    sheet.save(output_path)


def run_crop() -> dict:
    if not SOURCE_IMAGE.exists():
        raise FileNotFoundError(f"Missing source image: {SOURCE_IMAGE}")

    ensure_clean_dir(AUTO_DIR)
    ensure_clean_dir(TILE_DIR)

    with Image.open(SOURCE_IMAGE) as image:
        source = image.convert("RGBA")

    auto_records: list[dict] = []
    if has_transparency(source):
        auto_records = connected_component_crop(source)

    tile_records = grid_slice(source)
    all_records = auto_records + tile_records

    make_contact_sheet(auto_records, AUTO_CONTACT_SHEET, "EduQuake auto object crops")
    make_contact_sheet(tile_records, TILE_CONTACT_SHEET, "EduQuake 32x32 tile crops")

    CROP_REPORT.parent.mkdir(parents=True, exist_ok=True)
    with CROP_REPORT.open("w", encoding="utf-8") as report_file:
        json.dump(all_records, report_file, indent=2)

    return {
        "auto_count": len(auto_records),
        "tile_count": len(tile_records),
        "report": str(CROP_REPORT),
        "auto_contact_sheet": str(AUTO_CONTACT_SHEET),
        "tile_contact_sheet": str(TILE_CONTACT_SHEET),
    }


if __name__ == "__main__":
    result = run_crop()
    print(json.dumps(result, indent=2))
