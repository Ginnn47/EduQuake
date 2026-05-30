import { mapImages } from "./eduquakeAssets";

export const riskHotspots = [
  {
    id: "bantul",
    name: "Bantul",
    risk: "Tinggi",
    color: "#d9472f",
    x: 31,
    y: 68,
    map: mapImages.bantulMap,
    story: "Prioritas penguatan bangunan, latihan evakuasi warga, dan jalur titik kumpul.",
  },
  {
    id: "sleman",
    name: "Sleman",
    risk: "Sedang",
    color: "#f0a43d",
    x: 47,
    y: 28,
    map: mapImages.slemanMap,
    story: "Perlu perhatian pada struktur, lereng, dan jalur alternatif keluarga.",
  },
  {
    id: "gunungkidul",
    name: "Gunungkidul",
    risk: "Terkendali",
    color: "#3e9b5f",
    x: 70,
    y: 72,
    map: mapImages.gunungkidulMap,
    story: "Risiko relatif lebih rendah, tetapi air bersih dan komunikasi tetap penting.",
  },
];
