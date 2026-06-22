from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "public" / "game" / "assets" / "sprites" / "player_student.png"
OUTPUT = ROOT / "frontend" / "public" / "game" / "assets" / "sprites" / "player_student_clean.png"
VERSIONED_OUTPUT = ROOT / "frontend" / "public" / "game" / "assets" / "sprites" / "player_student_clean_v3.png"
FRAME_COLUMNS = 4
FRAME_ROWS = 4
TARGET_SIZE = 1024
TARGET_FRAME_SIZE = TARGET_SIZE // FRAME_COLUMNS
THRESHOLD = 1
BOTTOM_PADDING = 26


def is_edge_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    return alpha > 0 and red <= THRESHOLD and green <= THRESHOLD and blue <= THRESHOLD


def remove_connected_edge_black(frame: Image.Image) -> Image.Image:
    rgba_frame = frame.convert("RGBA")
    pixels = rgba_frame.load()
    width, height = rgba_frame.size
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def index(x: int, y: int) -> int:
        return y * width + x

    for x in range(width):
        for y in (0, height - 1):
            if is_edge_background(pixels[x, y]):
                visited[index(x, y)] = 1
                queue.append((x, y))

    for y in range(height):
        for x in (0, width - 1):
            if is_edge_background(pixels[x, y]):
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
            if visited[next_index] or not is_edge_background(pixels[nx, ny]):
                continue

            visited[next_index] = 1
            queue.append((nx, ny))

    return rgba_frame


def keep_largest_visible_component(frame: Image.Image) -> Image.Image:
    rgba_frame = frame.convert("RGBA")
    pixels = rgba_frame.load()
    width, height = rgba_frame.size
    visited = bytearray(width * height)
    components: list[list[tuple[int, int]]] = []

    def index(x: int, y: int) -> int:
        return y * width + x

    for y in range(height):
        for x in range(width):
            current_index = index(x, y)
            if visited[current_index] or pixels[x, y][3] == 0:
                continue

            component: list[tuple[int, int]] = []
            queue: deque[tuple[int, int]] = deque([(x, y)])
            visited[current_index] = 1

            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))

                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue

                    next_index = index(nx, ny)
                    if visited[next_index] or pixels[nx, ny][3] == 0:
                        continue

                    visited[next_index] = 1
                    queue.append((nx, ny))

            components.append(component)

    if not components:
        return rgba_frame

    keep = set(max(components, key=len))

    for y in range(height):
        for x in range(width):
            if (x, y) not in keep:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)

    return rgba_frame


def recenter_frame(frame: Image.Image) -> Image.Image:
    rgba_frame = frame.convert("RGBA")
    bounds = rgba_frame.getbbox()
    if not bounds:
        return rgba_frame

    character = rgba_frame.crop(bounds)
    output = Image.new("RGBA", rgba_frame.size, (0, 0, 0, 0))
    x = (rgba_frame.width - character.width) // 2
    y = rgba_frame.height - character.height - BOTTOM_PADDING
    y = max(12, min(y, rgba_frame.height - character.height))
    output.paste(character, (x, y), character)
    return output


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source sprite: {SOURCE}")

    with Image.open(SOURCE) as source:
        source = source.convert("RGBA")
        width, height = source.size
        cleaned = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))

        for row in range(FRAME_ROWS):
            for column in range(FRAME_COLUMNS):
                left = round(column * width / FRAME_COLUMNS)
                top = round(row * height / FRAME_ROWS)
                right = round((column + 1) * width / FRAME_COLUMNS)
                bottom = round((row + 1) * height / FRAME_ROWS)
                frame = source.crop((left, top, right, bottom))
                frame = frame.resize((TARGET_FRAME_SIZE, TARGET_FRAME_SIZE), Image.Resampling.LANCZOS)
                cleaned_frame = remove_connected_edge_black(frame)
                cleaned_frame = keep_largest_visible_component(cleaned_frame)
                cleaned_frame = recenter_frame(cleaned_frame)
                cleaned.paste(
                    cleaned_frame,
                    (column * TARGET_FRAME_SIZE, row * TARGET_FRAME_SIZE),
                    cleaned_frame,
                )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    cleaned.save(OUTPUT)
    cleaned.save(VERSIONED_OUTPUT)
    print(
        f"Saved {OUTPUT.relative_to(ROOT)} "
        f"({cleaned.width}x{cleaned.height}, {TARGET_FRAME_SIZE}x{TARGET_FRAME_SIZE} frames)"
    )
    print(f"Saved {VERSIONED_OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
