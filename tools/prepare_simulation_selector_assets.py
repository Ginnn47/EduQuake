from __future__ import annotations

import json
import math
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "frontend" / "src" / "assets" / "simulation"
OUTPUT_ROOT = ROOT / "frontend" / "public" / "game" / "assets" / "objects" / "simulation_selector"
REPORT_FILE = ROOT / "frontend" / "public" / "game" / "assets" / "objects" / "simulation_selector_report.json"
CONTACT_SHEET = ROOT / "frontend" / "public" / "game" / "assets" / "objects" / "simulation_selector_contact_sheet.png"

SOURCES = [
    {
        "key": "tileset1",
        "file": "tileset1.png",
        "mode": "component",
    },
    {
        "key": "tileset2_hazard",
        "file": "tileset2-hazard.png",
        "mode": "component",
    },
    {
        "key": "interior_z",
        "file": "InteriorZ1.png",
        "mode": "grid",
    },
]

TILE_SIZE = 32
MIN_COMPONENT_AREA = 90
MAX_COMPONENTS_PER_SOURCE = 500
CONTACT_COLUMNS = 12


def reset_output_dir() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    for child in OUTPUT_ROOT.iterdir():
        if child.is_file():
            child.unlink()
        elif child.is_dir():
            shutil.rmtree(child)


def is_background_pixel(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha <= 8:
        return True

    # The simulation tileset images use a baked white/checker preview background.
    # Keep dark outlines and colored pixels, drop near-white neutral background.
    near_white = red >= 226 and green >= 226 and blue >= 226
    neutral = max(red, green, blue) - min(red, green, blue) <= 22
    return near_white and neutral


def remove_connected_edge_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def index(x: int, y: int) -> int:
        return y * width + x

    for x in range(width):
        for y in (0, height - 1):
            if is_background_pixel(pixels[x, y]):
                visited[index(x, y)] = 1
                queue.append((x, y))

    for y in range(height):
        for x in (0, width - 1):
            if is_background_pixel(pixels[x, y]):
                visited[index(x, y)] = 1
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)

        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue

            next_index = index(nx, ny)
            if visited[next_index] or not is_background_pixel(pixels[nx, ny]):
                continue

            visited[next_index] = 1
            queue.append((nx, ny))

    return rgba


def connected_component_crop(source: Image.Image, source_key: str, source_file: str) -> list[dict]:
    rgba = source.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    visited = bytearray(width * height)
    records: list[dict] = []
    output_dir = OUTPUT_ROOT / source_key
    output_dir.mkdir(parents=True, exist_ok=True)

    def index(x: int, y: int) -> int:
        return y * width + x

    for y in range(height):
        for x in range(width):
            start_index = index(x, y)
            if visited[start_index] or is_background_pixel(pixels[x, y]):
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
                    if visited[next_index] or is_background_pixel(pixels[nx, ny]):
                        continue

                    visited[next_index] = 1
                    queue.append((nx, ny))

            if area < MIN_COMPONENT_AREA:
                continue

            pad = 3
            crop_box = (
                max(0, min_x - pad),
                max(0, min_y - pad),
                min(width, max_x + pad + 1),
                min(height, max_y + pad + 1),
            )
            cropped = remove_connected_edge_background(rgba.crop(crop_box))
            name = f"{source_key}_object_{len(records) + 1:03d}.png"
            output_path = output_dir / name
            cropped.save(output_path)
            records.append(
                {
                    "name": name,
                    "path": f"/game/assets/objects/simulation_selector/{source_key}/{name}",
                    "source": source_file,
                    "sourceKey": source_key,
                    "x": crop_box[0],
                    "y": crop_box[1],
                    "width": cropped.width,
                    "height": cropped.height,
                    "method": "component_from_simulation_tileset",
                    "likelyRole": guess_likely_role(source_key, crop_box),
                }
            )

            if len(records) >= MAX_COMPONENTS_PER_SOURCE:
                return records

    return records


def is_useful_tile(tile: Image.Image) -> bool:
    rgba = tile.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getbbox() is None:
        return False

    visible = sum(1 for value in alpha.getdata() if value > 8)
    if visible < 32:
        return False

    colors = rgba.resize((8, 8), Image.Resampling.NEAREST).getcolors(maxcolors=256) or []
    opaque_colors = [color for _, color in colors if color[3] > 8]
    return len(set(opaque_colors)) > 1


def grid_slice(source: Image.Image, source_key: str, source_file: str) -> list[dict]:
    rgba = source.convert("RGBA")
    width, height = rgba.size
    output_dir = OUTPUT_ROOT / source_key
    output_dir.mkdir(parents=True, exist_ok=True)
    records: list[dict] = []

    for y in range(0, height - (height % TILE_SIZE), TILE_SIZE):
        for x in range(0, width - (width % TILE_SIZE), TILE_SIZE):
            tile = rgba.crop((x, y, x + TILE_SIZE, y + TILE_SIZE))
            if not is_useful_tile(tile):
                continue

            name = f"{source_key}_tile_{len(records) + 1:04d}.png"
            output_path = output_dir / name
            tile.save(output_path)
            records.append(
                {
                    "name": name,
                    "path": f"/game/assets/objects/simulation_selector/{source_key}/{name}",
                    "source": source_file,
                    "sourceKey": source_key,
                    "x": x,
                    "y": y,
                    "width": TILE_SIZE,
                    "height": TILE_SIZE,
                    "method": "grid_32_from_interior_z",
                    "likelyRole": "interior_tile",
                }
            )

    return records


def guess_likely_role(source_key: str, box: tuple[int, int, int, int]) -> str:
    x, y, right, bottom = box
    width = right - x
    height = bottom - y

    if 86 <= y <= 190 and width > 120:
        return "chalkboard"
    if 180 <= y <= 310 and 60 <= width <= 130:
        return "window_or_door"
    if 300 <= y <= 520 and height <= 120:
        return "desk_or_chair"
    if 700 <= y <= 1010 and width > 120:
        return "bookshelf_or_cabinet"
    if 1030 <= y <= 1280:
        return "poster"
    if 1280 <= y <= 1460:
        return "map_or_wall_poster"
    if 1420 <= y <= 1580:
        return "plant_or_classroom_item"
    if 1600 <= y <= 1780:
        return "small_item"
    if 1800 <= y <= 1980:
        return "safety_or_hazard"
    if y >= 1980:
        return "bag_or_ground_hazard"
    return f"{source_key}_object"


def make_contact_sheet(records: list[dict]) -> None:
    font = ImageFont.load_default()
    thumb_size = 54
    label_height = 28
    padding = 8
    columns = min(CONTACT_COLUMNS, max(1, len(records)))
    rows = max(1, math.ceil(len(records) / columns))
    cell_width = thumb_size + padding
    cell_height = thumb_size + label_height + padding
    header_height = 26
    sheet = Image.new(
        "RGBA",
        (columns * cell_width + padding, rows * cell_height + header_height + padding),
        (24, 20, 16, 255),
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((padding, 8), "EduQuake simulation tileset crops", fill=(244, 223, 157, 255), font=font)

    for index, record in enumerate(records):
        source_file = ROOT / "frontend" / "public" / record["path"].lstrip("/")
        with Image.open(source_file) as image:
            thumb = image.convert("RGBA")
            thumb.thumbnail((thumb_size, thumb_size), Image.Resampling.NEAREST)

        col = index % columns
        row = index // columns
        cell_x = padding + col * cell_width
        cell_y = header_height + row * cell_height
        image_x = cell_x + (thumb_size - thumb.width) // 2
        image_y = cell_y + (thumb_size - thumb.height) // 2
        sheet.alpha_composite(thumb, (image_x, image_y))
        draw.rectangle((cell_x, cell_y, cell_x + thumb_size, cell_y + thumb_size), outline=(122, 75, 34, 255))
        draw.text((cell_x, cell_y + thumb_size + 2), record["name"].removesuffix(".png")[-18:], fill=(244, 223, 157, 255), font=font)

    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_SHEET)


def run() -> dict:
    reset_output_dir()
    records: list[dict] = []

    for source_config in SOURCES:
        source_path = SOURCE_DIR / source_config["file"]
        if not source_path.exists():
            raise FileNotFoundError(f"Missing source image: {source_path}")

        with Image.open(source_path) as image:
            if source_config["mode"] == "grid":
                source_records = grid_slice(image, source_config["key"], source_config["file"])
            else:
                source_records = connected_component_crop(image, source_config["key"], source_config["file"])
        records.extend(source_records)

    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with REPORT_FILE.open("w", encoding="utf-8") as file:
        json.dump(records, file, indent=2)

    make_contact_sheet(records)

    counts_by_source: dict[str, int] = {}
    for record in records:
        counts_by_source[record["sourceKey"]] = counts_by_source.get(record["sourceKey"], 0) + 1

    return {
        "report": str(REPORT_FILE.relative_to(ROOT)).replace("\\", "/"),
        "contactSheet": str(CONTACT_SHEET.relative_to(ROOT)).replace("\\", "/"),
        "total": len(records),
        "countsBySource": counts_by_source,
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
