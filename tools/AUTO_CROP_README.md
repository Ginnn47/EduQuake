# EduQuake Auto Crop Asset Pipeline

Pipeline ini menyiapkan asset prototype dari `reference_assets/nds_game.zip` tanpa membuka Tiled Map Editor dan tanpa menyalin semua asset ke folder public.

## Cara Menjalankan

```powershell
py -m pip install pillow
py tools/run_asset_prepare.py
```

Jika `py` tidak tersedia:

```powershell
python tools/run_asset_prepare.py
```

## Output

Script akan membuat atau memperbarui:

```txt
frontend/public/game/assets/objects/auto/
frontend/public/game/assets/objects/tiles/
frontend/public/game/assets/objects/auto_contact_sheet.png
frontend/public/game/assets/objects/tile_contact_sheet.png
frontend/public/game/assets/objects/crop_report.json
frontend/src/game/assetManifest.js
```

## Catatan

Ini adalah auto-crop awal untuk reference/prototype-only. Asset hasil crop belum final untuk EduQuake dan tidak boleh dianggap sebagai asset produksi.
