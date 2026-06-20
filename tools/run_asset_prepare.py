from __future__ import annotations

import json
import shutil
import zipfile
from pathlib import Path

from auto_crop_classroom_assets import ASSET_ROOT, run_crop


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIR = ROOT / "reference_assets"
ZIP_PATH = REFERENCE_DIR / "nds_game.zip"
EXTRACTED_DIR = REFERENCE_DIR / "extracted"
MANIFEST_PATH = ROOT / "frontend" / "src" / "game" / "assetManifest.js"

OUTPUT_DIRS = [
    ASSET_ROOT / "source",
    ASSET_ROOT / "tilesets",
    ASSET_ROOT / "sprites",
    ASSET_ROOT / "ui",
    ASSET_ROOT / "effects",
    ASSET_ROOT / "audio",
    ASSET_ROOT / "objects",
    ASSET_ROOT / "objects" / "auto",
    ASSET_ROOT / "objects" / "tiles",
]

SOURCE_CANDIDATES = {
    "classroom_interior": [
        "Graphics/Tilesets/Interior1.png",
        "Graphics/Tilesets/InteriorZ1.png",
        "Graphics/Tilesets/InteriorLiga.png",
        "patch/Graphics/Tilesets/Interior1.png",
        "patch/Graphics/Tilesets/InteriorZ1.png",
        "patch/Graphics/Tilesets/InteriorLiga.png",
    ],
    "dialog_box": [
        "Graphics/Windowskins/SpeechShow.png",
        "Graphics/Windowskins/Windowskin.png",
        "Graphics/Windowskins/Window.png",
        "Graphics/UI/Battle/overlay_message.png",
    ],
    "earthquake_effect": [
        "Graphics/Animations/Earth1.png",
        "Graphics/Weather/sandstorm_tile.png",
    ],
    "quake_audio": [
        "Audio/SE/Anim/PRSFX- Earthquake.wav",
        "Audio/SE/Earthquake1.wav",
        "Audio/SE/Earthquake2.wav",
    ],
}

COPY_TARGETS = {
    "classroom_interior": [
        ASSET_ROOT / "source" / "classroom_interior_source.png",
        ASSET_ROOT / "tilesets" / "classroom_interior.png",
    ],
    "dialog_box": [ASSET_ROOT / "ui" / "dialog_box.png"],
    "earthquake_effect": [ASSET_ROOT / "effects" / "earthquake_effect.png"],
    "quake_audio": [ASSET_ROOT / "audio" / "quake.wav"],
}

LOCAL_NPC_SPRITES = {
    "guru": ROOT / "frontend" / "src" / "assets" / "npc" / "guru.png",
    "murid": ROOT / "frontend" / "src" / "assets" / "npc" / "murid.png",
    "timsar": ROOT / "frontend" / "src" / "assets" / "npc" / "timsar.png",
    "prof": ROOT / "frontend" / "src" / "assets" / "npc" / "prof.png",
}


def ensure_output_dirs() -> None:
    for directory in OUTPUT_DIRS:
        directory.mkdir(parents=True, exist_ok=True)


def extract_zip_if_needed() -> bool:
    if not ZIP_PATH.exists():
        raise FileNotFoundError(f"Missing ZIP: {ZIP_PATH}")

    if EXTRACTED_DIR.exists() and any(EXTRACTED_DIR.iterdir()):
        return False

    EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ZIP_PATH) as archive:
        archive.extractall(EXTRACTED_DIR)

    return True


def extracted_roots() -> list[Path]:
    roots = [EXTRACTED_DIR]
    roots.extend(path for path in EXTRACTED_DIR.iterdir() if path.is_dir())
    return roots


def find_asset(candidates: list[str]) -> Path | None:
    normalized_candidates = [candidate.replace("\\", "/") for candidate in candidates]
    roots = extracted_roots()

    for root in roots:
        for candidate in normalized_candidates:
            path = root / Path(candidate)
            if path.exists():
                return path

    all_files = [path for path in EXTRACTED_DIR.rglob("*") if path.is_file()]
    for candidate in normalized_candidates:
        candidate_name = Path(candidate).name.lower()
        for path in all_files:
            if path.name.lower() == candidate_name:
                return path

    for candidate in normalized_candidates:
        candidate_stem = Path(candidate).stem.lower()
        for path in all_files:
            if candidate_stem and candidate_stem in path.stem.lower():
                return path

    return None


def copy_selected_assets() -> dict[str, dict[str, str | list[str] | None]]:
    selected: dict[str, dict[str, str | list[str] | None]] = {}

    for key, candidates in SOURCE_CANDIDATES.items():
        source = find_asset(candidates)
        targets = COPY_TARGETS[key]
        final_targets = []

        if source is None:
            selected[key] = {
                "source": None,
                "targets": [str(target.relative_to(ROOT)).replace("\\", "/") for target in targets],
            }
            continue

        for target in targets:
            target.parent.mkdir(parents=True, exist_ok=True)

            final_target = target
            if key == "quake_audio" and source.suffix.lower() != ".wav":
                final_target = target.with_suffix(source.suffix.lower())

            shutil.copy2(source, final_target)
            final_targets.append(final_target)

        selected[key] = {
            "source": str(source.relative_to(ROOT)).replace("\\", "/"),
            "targets": [str(target.relative_to(ROOT)).replace("\\", "/") for target in final_targets],
        }

    return selected


def copy_local_npc_sprites() -> dict[str, dict[str, str | list[str] | None]]:
    selected: dict[str, dict[str, str | list[str] | None]] = {}
    sprite_dir = ASSET_ROOT / "sprites"
    sprite_dir.mkdir(parents=True, exist_ok=True)

    for key, source in LOCAL_NPC_SPRITES.items():
        target = sprite_dir / f"{key}.png"

        if not source.exists():
            selected[key] = {
                "source": None,
                "targets": [str(target.relative_to(ROOT)).replace("\\", "/")],
            }
            continue

        shutil.copy2(source, target)
        selected[key] = {
            "source": str(source.relative_to(ROOT)).replace("\\", "/"),
            "targets": [str(target.relative_to(ROOT)).replace("\\", "/")],
        }

    murid_target = sprite_dir / "murid.png"
    player_target = sprite_dir / "player_student.png"
    if murid_target.exists():
        shutil.copy2(murid_target, player_target)
        selected["player_student"] = {
            "source": str((ROOT / "frontend" / "src" / "assets" / "npc" / "murid.png").relative_to(ROOT)).replace("\\", "/"),
            "targets": [str(player_target.relative_to(ROOT)).replace("\\", "/")],
        }

    return selected


def build_manifest_values() -> dict[str, str | None]:
    quake_candidates = sorted((ASSET_ROOT / "audio").glob("quake.*"))
    quake = f"/game/assets/audio/{quake_candidates[0].name}" if quake_candidates else None

    values = {
        "classroom": "/game/assets/tilesets/classroom_interior.png"
        if (ASSET_ROOT / "tilesets" / "classroom_interior.png").exists()
        else None,
        "player": "/game/assets/sprites/player_student.png"
        if (ASSET_ROOT / "sprites" / "player_student.png").exists()
        else None,
        "guru": "/game/assets/sprites/guru.png" if (ASSET_ROOT / "sprites" / "guru.png").exists() else None,
        "murid": "/game/assets/sprites/murid.png" if (ASSET_ROOT / "sprites" / "murid.png").exists() else None,
        "timsar": "/game/assets/sprites/timsar.png" if (ASSET_ROOT / "sprites" / "timsar.png").exists() else None,
        "prof": "/game/assets/sprites/prof.png" if (ASSET_ROOT / "sprites" / "prof.png").exists() else None,
        "dialogBox": "/game/assets/ui/dialog_box.png" if (ASSET_ROOT / "ui" / "dialog_box.png").exists() else None,
        "earthquake": "/game/assets/effects/earthquake_effect.png"
        if (ASSET_ROOT / "effects" / "earthquake_effect.png").exists()
        else None,
        "quake": quake,
        "autoContactSheet": "/game/assets/objects/auto_contact_sheet.png"
        if (ASSET_ROOT / "objects" / "auto_contact_sheet.png").exists()
        else None,
        "tileContactSheet": "/game/assets/objects/tile_contact_sheet.png"
        if (ASSET_ROOT / "objects" / "tile_contact_sheet.png").exists()
        else None,
        "cropReport": "/game/assets/objects/crop_report.json"
        if (ASSET_ROOT / "objects" / "crop_report.json").exists()
        else None,
    }
    return values


def write_manifest_from_values(values: dict[str, str | None]) -> None:
    def js(value: str | None) -> str:
        return json.dumps(value) if value else "null /* TODO: asset belum tersedia */"

    content = f"""export const ASSETS = {{
  tilesets: {{
    classroom: {js(values["classroom"])},
  }},
  sprites: {{
    player: {js(values["player"])},
    guru: {js(values["guru"])},
    murid: {js(values["murid"])},
    timsar: {js(values["timsar"])},
    prof: {js(values["prof"])},
  }},
  ui: {{
    dialogBox: {js(values["dialogBox"])},
  }},
  effects: {{
    earthquake: {js(values["earthquake"])},
  }},
  audio: {{
    quake: {js(values["quake"])},
  }},
  objects: {{
    autoContactSheet: {js(values["autoContactSheet"])},
    tileContactSheet: {js(values["tileContactSheet"])},
    cropReport: {js(values["cropReport"])},
  }},
}};
"""
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(content, encoding="utf-8")


def main() -> None:
    ensure_output_dirs()
    extracted_now = extract_zip_if_needed()
    selected_assets = copy_selected_assets()
    selected_sprites = copy_local_npc_sprites()
    crop_result = run_crop()
    manifest_values = build_manifest_values()
    write_manifest_from_values(manifest_values)

    print(
        json.dumps(
            {
                "zipExtracted": extracted_now,
                "selectedAssets": selected_assets,
                "selectedSprites": selected_sprites,
                "autoCropCount": crop_result["auto_count"],
                "gridTileCount": crop_result["tile_count"],
                "autoContactSheet": "/game/assets/objects/auto_contact_sheet.png",
                "tileContactSheet": "/game/assets/objects/tile_contact_sheet.png",
                "cropReport": "/game/assets/objects/crop_report.json",
                "assetManifest": str(MANIFEST_PATH.relative_to(ROOT)).replace("\\", "/"),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
