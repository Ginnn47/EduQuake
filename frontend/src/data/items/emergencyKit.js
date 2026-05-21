import { itemSprites } from "../../assets/eduquakeAssets";

export const emergencyKitItems = [
  {
    id: "water",
    name: "Air Minum",
    sprite: itemSprites.water,
    detail: "Minimal 3 liter per orang per hari.",
    required: true,
  },
  {
    id: "food",
    name: "Makanan",
    sprite: itemSprites.food,
    detail: "Siap saji, tahan lama, mudah dibuka.",
    required: true,
  },
  {
    id: "medicine",
    name: "P3K",
    sprite: itemSprites.medicine,
    detail: "Obat pribadi, perban, antiseptik.",
    required: true,
  },
  {
    id: "flashlight",
    name: "Senter",
    sprite: itemSprites.flashlight,
    detail: "Tambahkan baterai cadangan.",
    required: true,
  },
  {
    id: "radio",
    name: "Radio",
    sprite: itemSprites.radio,
    detail: "Untuk info resmi saat jaringan padat.",
    required: true,
  },
  {
    id: "documents",
    name: "Dokumen",
    sprite: itemSprites.documents,
    detail: "Simpan salinan tahan air.",
    required: true,
  },
];
