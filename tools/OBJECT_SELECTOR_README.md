# EduQuake Object Selector

Tool ini dipakai untuk memilih hasil auto-crop menjadi asset final classroom Phaser.

## Cara Pakai

1. Buka `tools/object-selector.html` di browser.
2. Jika browser tidak bisa auto-load JSON, pilih file:
   `frontend/public/game/assets/objects/crop_report.json`
3. Pilih role untuk asset yang dibutuhkan.
4. Klik `Export selected_game_assets.json`.
5. Simpan hasil export ke:
   `tools/selected_game_assets.json`
6. Jalankan:

```powershell
py tools/apply_selected_assets.py
```

Jika `py` tidak tersedia:

```powershell
python tools/apply_selected_assets.py
```

## Output

Asset final akan dibuat di:

```txt
frontend/public/game/assets/objects/classroom/
```

Report hasil copy akan dibuat di:

```txt
frontend/public/game/assets/objects/classroom/selected_assets_report.json
```

Ini hanya proses seleksi asset awal. Belum membuat gameplay, map, atau logic Phaser.
