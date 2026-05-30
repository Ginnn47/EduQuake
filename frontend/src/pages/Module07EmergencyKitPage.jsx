import { useState } from "react";
import obatItem from "../assets/items/obat-cutout.png";
import antiseptikItem from "../assets/items/antibiotik-cutout.png";
import perbanItem from "../assets/items/perban-cutout.png";
import kasaItem from "../assets/items/kasa-cutout.png";
import plesterItem from "../assets/items/plester-cutout.png";
import guntingItem from "../assets/items/gunting-cutout.png";
import pinsetItem from "../assets/items/pinset-cutout.png";
import sarungTanganItem from "../assets/items/sarungtangan-cutout.png";
import maskerItem from "../assets/items/masker-cutout.png";
import headDanger from "../assets/ui/head_danger.png";
import p3kPoster from "../assets/ui/07-p3k-clean.png";
import p3kCraftBoard from "../assets/ui/07-p3kracik-clean.png";
import actMed1 from "../assets/npc/07-actmed1-clean.png";
import actMed2 from "../assets/npc/07-actmed2-clean.png";
import actMed3 from "../assets/npc/07-actmed3-clean.png";
import actMed4 from "../assets/npc/07-actmed4-clean.png";
import { rewardItems } from "./bookRewards";

const craftRecipes = [
  {
    id: "antiseptik-perban",
    items: ["antiseptik", "perban"],
    title: "Pembersihan Luka",
    formula: "Antiseptik + Perban",
    itemA: { label: "Antiseptik", icon: antiseptikItem },
    itemB: { label: "Perban", icon: perbanItem },
    result: actMed1,
    resultLabel: "Pembersihan Luka",
    description: "Luka lecet atau gores kecil yang kotor perlu dibersihkan dengan antiseptik agar tidak infeksi.",
  },
  {
    id: "kasa-plester",
    items: ["kasa", "plester"],
    title: "Perlindungan Luka",
    formula: "Kasa + Plester",
    itemA: { label: "Kasa", icon: kasaItem },
    itemB: { label: "Plester", icon: plesterItem },
    result: actMed2,
    resultLabel: "Perlindungan Luka",
    description: "Luka kecil yang sudah bersih dan ditangani perlu ditutup plester agar terlindung dari debu dan gesekan.",
  },
  {
    id: "gunting-pinset",
    items: ["gunting", "pinset"],
    title: "Alat Bantu Medis",
    formula: "Gunting + Pinset",
    itemA: { label: "Gunting", icon: guntingItem },
    itemB: { label: "Pinset", icon: pinsetItem },
    result: actMed3,
    resultLabel: "Alat Bantu Medis",
    description: "Luka ringan dengan serpihan kecil dapat dibersihkan dengan pinset, sedangkan gunting bisa dipakai untuk memotong perban atau plester.",
  },
  {
    id: "sarungtangan-masker",
    items: ["sarungtangan", "masker"],
    title: "Perlindungan Diri",
    formula: "Sarung Tangan + Masker",
    itemA: { label: "Sarung Tangan", icon: sarungTanganItem },
    itemB: { label: "Masker", icon: maskerItem },
    result: actMed4,
    resultLabel: "Perlindungan Diri",
    description: "Saat menolong orang terluka, gunakan masker dan sarung tangan agar penolong dan korban terlindung satu sama lain.",
  },
];

const medkitMaterials = [
  { id: "antiseptik", label: "Antiseptik", icon: antiseptikItem, description: "Membersihkan luka agar risiko infeksi berkurang." },
  { id: "gunting", label: "Gunting", icon: guntingItem, description: "Memotong perban, kasa, atau bahan medis sesuai kebutuhan." },
  { id: "plester", label: "Plester", icon: plesterItem, description: "Menahan kasa atau menutup luka kecil agar terlindungi." },
  { id: "sarungtangan", label: "Sarung Tangan", icon: sarungTanganItem, description: "Melindungi tangan saat menolong dan merawat luka." },
  { id: "kasa", label: "Kasa", icon: kasaItem, description: "Menutup luka agar tetap bersih dan menyerap cairan luka." },
  { id: "pinset", label: "Pinset", icon: pinsetItem, description: "Mengambil serpihan kecil tanpa menyentuh luka langsung." },
  { id: "perban", label: "Perban", icon: perbanItem, description: "Membalut luka dan membantu menahan perdarahan ringan." },
  { id: "masker", label: "Masker", icon: maskerItem, description: "Menutup mulut dan hidung agar pertolongan lebih higienis." },
];

export const moduleMeta = {
  id: "p3k-emergency-kit",
  number: "07",
  navLabel: "Medic Station",
  title: "P3K Emergency Kit",
  icon: obatItem,
  image: p3kPoster,
  // Atur besar/posisi poster modul ini dari sini.
  posterStyle: {
    "--quest-poster-width": "min(96%, 485px)",
    "--quest-poster-max-height": "min(610px, 66vh)",
    "--quest-poster-offset-y": "-60px",
  },
  headerImage: headDanger,
  subtitle: "tetap tanggap dengan perlengkapan P3K yang tepat",
  pageTitle: "Racik Medkit Keluarga untuk Siaga Darurat",
  pageSubtitle: "Gunakan panah untuk memilih kombinasi item.",
  description: "Kenali isi P3K, fungsi antiseptik, dan perlengkapan kecil yang membantu menangani luka ringan setelah gempa.",
  leftPosterOnly: true,
  hideTip: true,
  rewards: [rewardItems.medkit, rewardItems.antibiotik],
  tip: "Pisahkan perlengkapan luka dari makanan dan dokumen agar mudah diambil saat tangan sedang terburu-buru.",
  gameplay: {
    type: "crafting",
    label: "Crafting Inventory",
    requiredActions: craftRecipes.map((recipe) => recipe.id),
    recipes: craftRecipes,
    leftTitle: "Crafting Bench",
    leftText: "Gabungkan item menjadi kit yang bisa dipakai di posko.",
  },
};

const Module07EmergencyKitPage = ({ gameplay, completedActions, markAction }) => {
  const recipes = gameplay.recipes;
  const craftedCount = recipes.filter((recipe) => completedActions.includes(recipe.id)).length;
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const selectedMaterial = medkitMaterials[selectedMaterialIndex];
  const itemA = medkitMaterials.find((material) => material.id === slotA);
  const itemB = medkitMaterials.find((material) => material.id === slotB);
  const currentRecipe = recipes.find((recipe) => {
    const selectedPair = [slotA, slotB].filter(Boolean).sort().join("+");

    return selectedPair && selectedPair === [...recipe.items].sort().join("+");
  });
  const craftedRecipe = currentRecipe && completedActions.includes(currentRecipe.id) ? currentRecipe : null;
  const craftStatus = !slotA || !slotB ? "Pilih dua item" : currentRecipe ? "Racikan sudah sesuai" : "Racikan belum cocok";
  const craftedResults = completedActions
    .map((actionId) => recipes.find((recipe) => recipe.id === actionId))
    .filter(Boolean);

  const selectMaterial = (direction) => {
    setSelectedMaterialIndex((current) => (current + direction + medkitMaterials.length) % medkitMaterials.length);
  };

  const insertMaterial = () => {
    if (!slotA) {
      setSlotA(selectedMaterial.id);
      return;
    }

    if (!slotB) {
      setSlotB(selectedMaterial.id);
      return;
    }

    setSlotA(selectedMaterial.id);
    setSlotB(null);
  };

  const craftRecipe = () => {
    if (!currentRecipe) {
      return;
    }

    markAction(currentRecipe.id, currentRecipe.id);
  };

  return (
    <section className="quest-gameplay quest-gameplay--module07">
      <article className="quest-module07-copy">
        <strong>Apa itu P3K?</strong>
        <p>
          P3K adalah perlengkapan pertolongan pertama untuk menangani luka ringan sebelum bantuan medis datang.
          Isinya harus mudah dicari, bersih, dan siap dipakai setelah gempa.
        </p>
      </article>

      <figure className="quest-module07-craft-board">
        <img className="quest-module07-craft-board__frame" src={p3kCraftBoard} alt="" />
        {itemA ? <img className="quest-module07-craft-item quest-module07-craft-item--a" src={itemA.icon} alt="" /> : null}
        {itemB ? <img className="quest-module07-craft-item quest-module07-craft-item--b" src={itemB.icon} alt="" /> : null}
        {craftedRecipe ? <img className="quest-module07-craft-result" src={craftedRecipe.result} alt="" /> : null}
        <figcaption>
          <img className="quest-module07-description-item" src={selectedMaterial.icon} alt="" />
          <strong>{selectedMaterial.label}</strong>
          <span>{selectedMaterial.description}</span>
          <div className="quest-module07-craft-controls" aria-label="Pilih racikan medkit">
            <button type="button" onClick={() => selectMaterial(1)} aria-label="Material berikutnya">{"<"}</button>
            <button type="button" onClick={insertMaterial}>OK</button>
            <button type="button" onClick={() => selectMaterial(-1)} aria-label="Material sebelumnya">{">"}</button>
          </div>
          <small className={currentRecipe ? "is-valid" : "is-invalid"}>{craftStatus}</small>
        </figcaption>
        <button type="button" className={craftedRecipe ? "is-crafted" : ""} onClick={craftRecipe} disabled={!currentRecipe}>
          {craftedRecipe ? "TERACIK" : "RACIK ITEM"}
        </button>
      </figure>

      <article className="quest-module07-note">
        <strong>{craftedCount} / {recipes.length} hasil racikan</strong>
        {craftedResults.length ? (
          <div className="quest-module07-result-list">
            {craftedResults.map((recipe, index) => (
              <section key={recipe.id} className={index % 2 ? "is-reversed" : ""}>
                <span>
                  <b>{recipe.resultLabel}</b>
                  <small>{recipe.description}</small>
                </span>
                <img src={recipe.result} alt="" />
              </section>
            ))}
          </div>
        ) : (
          <p>Masukkan dua material ke slot Item 1 dan Item 2, lalu racik jika kombinasinya benar.</p>
        )}
      </article>
    </section>
  );
};

export default Module07EmergencyKitPage;
