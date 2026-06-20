from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "public" / "game" / "assets" / "sprites" / "player_student.png"
OUTPUT = ROOT / "frontend" / "public" / "game" / "assets" / "sprites" / "player_student_clean.png"
TARGET_SIZE = 1024
BLACK_THRESHOLD = 18


def is_edge_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    return alpha > 0 and red <= BLACK_THRESHOLD and green <= BLACK_THRESHOLD and blue <= BLACK_THRESHOLD


def remove_connected_edge_black(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
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

    return rgba


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source sprite: {SOURCE}")

    with Image.open(SOURCE) as source:
        cleaned = remove_connected_edge_black(source)

    cleaned = cleaned.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    cleaned.save(OUTPUT)
    print(f"Saved {OUTPUT.relative_to(ROOT)} ({TARGET_SIZE}x{TARGET_SIZE})")


if __name__ == "__main__":
    main()
