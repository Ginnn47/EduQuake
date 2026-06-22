from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import NamedTuple

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "frontend" / "src" / "assets" / "npc"
OUTPUT_DIR = ROOT / "frontend" / "public" / "game" / "assets" / "sprites"
SPRITE_NAMES = ("muridmc", "guru", "murid1", "murid2", "murid3", "murid4")

ALPHA_THRESHOLD = 8
EDGE_COLOR_DISTANCE = 46
FRAME_COLUMNS = 4
FRAME_ROWS = 4
TARGET_FRAME_SIZE = 256
TARGET_SHEET_SIZE = TARGET_FRAME_SIZE * FRAME_COLUMNS
PADDING = 18
FOOT_PADDING = 14
SOURCE_FRAME_BLEED = 46


class CleanFrame(NamedTuple):
    image: Image.Image
    bounds: tuple[int, int, int, int] | None


class CleanSprite(NamedTuple):
    name: str
    original_size: tuple[int, int]
    frames: list[CleanFrame]


def color_distance(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def border_background_color(image: Image.Image) -> tuple[int, int, int, int] | None:
    pixels = image.load()
    width, height = image.size
    samples: list[tuple[int, int, int, int]] = []

    for x in range(width):
        samples.append(pixels[x, 0])
        samples.append(pixels[x, height - 1])

    for y in range(height):
        samples.append(pixels[0, y])
        samples.append(pixels[width - 1, y])

    opaque_samples = [pixel for pixel in samples if pixel[3] > ALPHA_THRESHOLD]
    if not opaque_samples:
        return None

    opaque_samples.sort()
    return opaque_samples[len(opaque_samples) // 2]


def remove_connected_edge_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    background = border_background_color(rgba)
    if background is None:
        return rgba

    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def index(x: int, y: int) -> int:
        return y * width + x

    def is_background(x: int, y: int) -> bool:
        pixel = pixels[x, y]
        if pixel[3] <= ALPHA_THRESHOLD:
            return True
        return color_distance(pixel, background) <= EDGE_COLOR_DISTANCE

    for x in range(width):
        for y in (0, height - 1):
            if is_background(x, y):
                visited[index(x, y)] = 1
                queue.append((x, y))

    for y in range(height):
        for x in (0, width - 1):
            if is_background(x, y):
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
            if visited[next_index] or not is_background(nx, ny):
                continue

            visited[next_index] = 1
            queue.append((nx, ny))

    return rgba


def remove_low_alpha_noise(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()

    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha <= ALPHA_THRESHOLD:
                pixels[x, y] = (red, green, blue, 0)

    return rgba


def keep_visible_components(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
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
        return rgba

    keep = set(max(components, key=len))

    for y in range(height):
        for x in range(width):
            if (x, y) not in keep:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)

    return rgba


def extract_character(image: Image.Image) -> CleanFrame:
    rgba = image.convert("RGBA")
    bounds = rgba.getbbox()
    if not bounds:
        return CleanFrame(Image.new("RGBA", (1, 1), (0, 0, 0, 0)), None)

    return CleanFrame(rgba.crop(bounds), bounds)


def fit_character_to_canvas(character: Image.Image, scale: float) -> Image.Image:
    if character.getbbox() is None:
        return Image.new("RGBA", (TARGET_FRAME_SIZE, TARGET_FRAME_SIZE), (0, 0, 0, 0))

    fitted_size = (
        max(1, round(character.width * scale)),
        max(1, round(character.height * scale)),
    )
    character = character.resize(fitted_size, Image.Resampling.LANCZOS)

    output = Image.new("RGBA", (TARGET_FRAME_SIZE, TARGET_FRAME_SIZE), (0, 0, 0, 0))
    x = (TARGET_FRAME_SIZE - character.width) // 2
    y = TARGET_FRAME_SIZE - FOOT_PADDING - character.height
    y = max(PADDING, min(y, TARGET_FRAME_SIZE - character.height - FOOT_PADDING))
    output.paste(character, (x, y), character)
    return output


def collect_sprite(name: str) -> CleanSprite:
    source = SOURCE_DIR / f"{name}.png"
    if not source.exists():
        raise FileNotFoundError(f"Missing source sprite: {source}")

    with Image.open(source) as image:
        original = image.convert("RGBA")
        original_size = original.size
        frames: list[CleanFrame] = []

        for row in range(FRAME_ROWS):
            for column in range(FRAME_COLUMNS):
                cell_left = round(column * original.width / FRAME_COLUMNS)
                cell_top = round(row * original.height / FRAME_ROWS)
                cell_right = round((column + 1) * original.width / FRAME_COLUMNS)
                cell_bottom = round((row + 1) * original.height / FRAME_ROWS)
                left = max(0, cell_left - SOURCE_FRAME_BLEED)
                top = max(0, cell_top - SOURCE_FRAME_BLEED)
                right = min(original.width, cell_right + SOURCE_FRAME_BLEED)
                bottom = min(original.height, cell_bottom + SOURCE_FRAME_BLEED)
                frame = original.crop((left, top, right, bottom))
                frame = remove_low_alpha_noise(frame)
                frame = remove_connected_edge_background(frame)
                frame = keep_visible_components(frame)
                frames.append(extract_character(frame))

    return CleanSprite(name=name, original_size=original_size, frames=frames)


def calculate_global_scale(sprites: list[CleanSprite]) -> float:
    visible_frames = [
        frame.image
        for sprite in sprites
        for frame in sprite.frames
        if frame.bounds is not None
    ]
    if not visible_frames:
        return 1

    max_width = max(frame.width for frame in visible_frames)
    max_height = max(frame.height for frame in visible_frames)
    target_width = TARGET_FRAME_SIZE - PADDING * 2
    target_height = TARGET_FRAME_SIZE - PADDING - FOOT_PADDING
    return min(target_width / max_width, target_height / max_height)


def save_sprite(sprite: CleanSprite, scale: float) -> dict[str, object]:
    output = OUTPUT_DIR / f"{sprite.name}.png"
    cleaned = Image.new("RGBA", (TARGET_SHEET_SIZE, TARGET_SHEET_SIZE), (0, 0, 0, 0))

    for index, frame in enumerate(sprite.frames):
        row = index // FRAME_COLUMNS
        column = index % FRAME_COLUMNS
        fitted = fit_character_to_canvas(frame.image, scale)
        cleaned.paste(
            fitted,
            (column * TARGET_FRAME_SIZE, row * TARGET_FRAME_SIZE),
            fitted,
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    cleaned.save(output)

    return {
        "name": sprite.name,
        "source": str((SOURCE_DIR / f"{sprite.name}.png").relative_to(ROOT)).replace("\\", "/"),
        "output": str(output.relative_to(ROOT)).replace("\\", "/"),
        "originalSize": sprite.original_size,
        "frameBounds": [frame.bounds for frame in sprite.frames],
        "outputSize": cleaned.size,
    }


def main() -> None:
    sprites = [collect_sprite(name) for name in SPRITE_NAMES]
    scale = calculate_global_scale(sprites)
    print(f"Using shared frame scale: {scale:.4f}")

    for sprite in sprites:
        result = save_sprite(sprite, scale)
        print(
            f"{result['name']}: {result['originalSize']} -> {result['outputSize']} "
            f"frames={len(result['frameBounds'])} saved={result['output']}"
        )


if __name__ == "__main__":
    main()
