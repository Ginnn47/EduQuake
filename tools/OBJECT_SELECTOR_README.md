# EduQuake Object Selector

Tool ini dipakai untuk memilih hasil auto-crop menjadi asset final classroom Phaser.

## Cara Pakai

1. Untuk asset classroom lama, buka `tools/object-selector.html` di browser.
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

## Selector Baru Dari Assets Simulation

Untuk membuat pilihan object baru dari:

- `frontend/src/assets/simulation/tileset1.png`
- `frontend/src/assets/simulation/tileset2-hazard.png`
- `frontend/src/assets/simulation/InteriorZ1.png`

jalankan:

```powershell
python tools/prepare_simulation_selector_assets.py
```

Output report baru:

```txt
frontend/public/game/assets/objects/simulation_selector_report.json
```

Lalu:

1. Buka `tools/object-selector.html`.
2. Pada dropdown report, pilih `New simulation tileset selector report`.
3. Gunakan search seperti `poster`, `plant`, `hazard`, `interior_tile`, atau nama source.
4. Untuk wall, sekarang tersedia role terpisah:
   `wall_front` untuk dinding depan kelas dan `wall_border` untuk wall yang mengitari map.
5. Untuk poster dan plant, sekarang tersedia role tambahan:
   `poster_2` dan `plant_2`.
6. Untuk debris, sekarang tersedia 4 variasi:
   `debris_1`, `debris_2`, `debris_3`, dan `debris_4`.
7. Untuk dekor classroom tambahan, tersedia role:
   `bigtrash`, `map`, `mading`, `medic`, `alarm`, dan `pemadam`.
8. Export seperti biasa ke `tools/selected_game_assets.json`.
9. Jalankan `python tools/apply_selected_assets.py`.

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
