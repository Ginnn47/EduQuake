import airItem from "../assets/items/air-cutout.png";
import antibiotikItem from "../assets/items/antibiotik-cutout.png";
import atkItem from "../assets/items/atk-cutout.png";
import bateraiItem from "../assets/items/baterai-cutout.png";
import dokplusItem from "../assets/items/dokplus-cutout.png";
import guntingItem from "../assets/items/gunting-cutout.png";
import lakbanLukaItem from "../assets/items/lakbanluka-cutout.png";
import makananInstanItem from "../assets/items/makananinstan-cutout.png";
import maskerItem from "../assets/items/masker-cutout.png";
import medkitItem from "../assets/items/medkit-cutout.png";
import obatItem from "../assets/items/obat-cutout.png";
import pasporItem from "../assets/items/paspor-cutout.png";
import ktpItem from "../assets/items/ktp-cutout.png";
import plesterItem from "../assets/items/plester-cutout.png";
import radioItem from "../assets/items/radio-cutout.png";
import senterItem from "../assets/items/senter-cutout.png";
import tasItem from "../assets/items/tas72jam-cutout.png";
import { badgeSprites } from "../constants/eduquakeAssets";

const alatTulisReward = { key: "alat-tulis", label: "Alat Tulis", icon: atkItem, description: "Mencatat jalur aman dan kontak penting." };
const dokPentingReward = { key: "dokpenting", label: "Dokumen Penting", icon: dokplusItem, description: "Salinan data keluarga untuk kondisi darurat." };
const kartuIdentitasReward = { key: "kartu-identitas", label: "Kartu Identitas", icon: ktpItem, description: "Identitas diri untuk pendataan bantuan." };

export const rewardItems = {
  alatTulis: alatTulisReward,
  atk: alatTulisReward,
  paspor: { key: "paspor", label: "Paspor", icon: pasporItem, description: "Dokumen identitas penting untuk keadaan darurat." },
  kartuIdentitas: kartuIdentitasReward,
  senter: { key: "senter", label: "Senter", icon: senterItem, description: "Membantu melihat saat listrik padam." },
  gunting: { key: "gunting", label: "Gunting", icon: guntingItem, description: "Memotong perban, tali, dan kemasan bantuan." },
  lakbanLuka: { key: "lakban-luka", label: "Lakban Luka", icon: lakbanLukaItem, description: "Merekatkan penutup luka sementara." },
  air: { key: "air", label: "Air Minum", icon: airItem, description: "Menjaga hidrasi setelah evakuasi." },
  makananInstan: { key: "makanan-instan", label: "Makanan Instan", icon: makananInstanItem, description: "Bekal cepat saat akses dapur terbatas." },
  radio: { key: "radio", label: "Radio", icon: radioItem, description: "Memantau informasi resmi saat jaringan padat." },
  baterai: { key: "baterai", label: "Baterai", icon: bateraiItem, description: "Cadangan daya untuk alat penting." },
  masker: { key: "masker", label: "Masker", icon: maskerItem, description: "Melindungi pernapasan dari debu." },
  medkit: { key: "medkit", label: "Medkit", icon: medkitItem, description: "Paket P3K untuk penanganan awal." },
  plester: { key: "plester", label: "Plester", icon: plesterItem, description: "Menutup luka kecil dengan cepat." },
  antibiotik: { key: "antibiotik", label: "Antibiotik", icon: antibiotikItem, description: "Persediaan obat sesuai arahan medis." },
  obat: { key: "obat", label: "Obat", icon: obatItem, description: "Kebutuhan kesehatan harian keluarga." },
  tas72Jam: { key: "tas-72-jam", label: "Tas 72 Jam", icon: tasItem, description: "Tas siaga untuk tiga hari pertama." },
  dokplus: dokPentingReward,
  dokpenting: dokPentingReward,
  badge1: { key: "badge-aware-citizen", label: "Badge 01", icon: badgeSprites.awareCitizen, inventory: false },
  badge2: { key: "badge-community-guardian", label: "Badge 02", icon: badgeSprites.communityGuardian, inventory: false },
  badge3: { key: "badge-prepared-resident", label: "Badge 03", icon: badgeSprites.preparedResident, inventory: false },
  badge4: { key: "badge-survival-ready", label: "Badge 04", icon: badgeSprites.survivalReady, inventory: false },
  trueBadge: { key: "true-end-badge", label: "True End Badge", icon: badgeSprites.survivalReady, inventory: false },
};

export const inventoryItems = [
  rewardItems.paspor,
  rewardItems.kartuIdentitas,
  rewardItems.senter,
  rewardItems.gunting,
  rewardItems.air,
  rewardItems.makananInstan,
  rewardItems.alatTulis,
  rewardItems.dokpenting,
  rewardItems.radio,
  rewardItems.baterai,
  rewardItems.masker,
  rewardItems.obat,
  rewardItems.medkit,
  rewardItems.antibiotik,
];
