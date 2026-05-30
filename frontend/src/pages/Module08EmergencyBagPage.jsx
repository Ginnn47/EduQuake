import { useEffect, useMemo, useState } from "react";
import tasItem from "../assets/items/tas72jam-cutout.png";
import head72Jam from "../assets/ui/head_72jam.png";
import bagBoard from "../assets/ui/08-bag-clean.png";
import inventoryBoard from "../assets/ui/08-inv-clean.png";
import missionBoard from "../assets/ui/08-misi-clean.png";
import missionEndBoard from "../assets/ui/08-misiend-clean.png";
import materialBoard from "../assets/ui/08-materi-clean.png";
import { rewardItems } from "./bookRewards";

const requiredBagKeys = [
  "paspor",
  "kartu-identitas",
  "senter",
  "gunting",
  "air",
  "makanan-instan",
  "alat-tulis",
  "dokpenting",
  "radio",
  "baterai",
  "masker",
  "obat",
  "medkit",
  "antibiotik",
];

const bagItems = [
  { key: "paspor", label: "Paspor", icon: rewardItems.paspor.icon, weight: 1 },
  { key: "kartu-identitas", label: "Kartu Identitas", icon: rewardItems.kartuIdentitas.icon, weight: 1 },
  { key: "senter", label: "Senter", icon: rewardItems.senter.icon, weight: 2 },
  { key: "gunting", label: "Gunting", icon: rewardItems.gunting.icon, weight: 1 },
  { key: "air", label: "Air", icon: rewardItems.air.icon, weight: 3 },
  { key: "makanan-instan", label: "Makanan Instan", icon: rewardItems.makananInstan.icon, weight: 2 },
  { key: "alat-tulis", label: "Alat Tulis", icon: rewardItems.alatTulis.icon, weight: 1 },
  { key: "dokpenting", label: "Dokumen Penting", icon: rewardItems.dokpenting.icon, weight: 1 },
  { key: "radio", label: "Radio", icon: rewardItems.radio.icon, weight: 2 },
  { key: "baterai", label: "Baterai", icon: rewardItems.baterai.icon, weight: 1 },
  { key: "masker", label: "Masker", icon: rewardItems.masker.icon, weight: 1 },
  { key: "obat", label: "Obat", icon: rewardItems.obat.icon, weight: 2 },
  { key: "medkit", label: "Medkit", icon: rewardItems.medkit.icon, weight: 2 },
  { key: "antibiotik", label: "Antibiotik", icon: rewardItems.antibiotik.icon, weight: 1 },
];

const bagTargets = [
  { id: "slot-01", label: "Slot 01", x: "29.31%", y: "25.98%", w: "11.35%", h: "10.16%" },
  { id: "slot-02", label: "Slot 02", x: "43.88%", y: "25.91%", w: "11.53%", h: "10.24%" },
  { id: "slot-03", label: "Slot 03", x: "58.98%", y: "25.91%", w: "11.71%", h: "10.24%" },
  { id: "slot-04", label: "Slot 04", x: "34.50%", y: "42.09%", w: "12.06%", h: "9.95%" },
  { id: "slot-05", label: "Slot 05", x: "53.17%", y: "42.09%", w: "12.06%", h: "10.02%" },
  { id: "slot-06", label: "Slot 06", x: "26.99%", y: "58.05%", w: "11.62%", h: "10.24%" },
  { id: "slot-07", label: "Slot 07", x: "43.97%", y: "58.05%", w: "11.62%", h: "10.16%" },
  { id: "slot-08", label: "Slot 08", x: "61.04%", y: "58.05%", w: "11.97%", h: "10.16%" },
  { id: "slot-09", label: "Slot 09", x: "21.54%", y: "75.66%", w: "7.24%", h: "8.30%" },
  { id: "slot-10", label: "Slot 10", x: "31.01%", y: "75.66%", w: "7.24%", h: "8.30%" },
  { id: "slot-11", label: "Slot 11", x: "40.30%", y: "75.66%", w: "7.33%", h: "8.30%" },
  { id: "slot-12", label: "Slot 12", x: "51.92%", y: "75.66%", w: "7.51%", h: "8.30%" },
  { id: "slot-13", label: "Slot 13", x: "61.57%", y: "75.66%", w: "7.42%", h: "8.30%" },
  { id: "slot-14", label: "Slot 14", x: "71.13%", y: "75.59%", w: "7.51%", h: "8.38%" },
];

const inventorySlots = [
  { x: 14, y: 51 },
  { x: 31.1, y: 51 },
  { x: 48.2, y: 51 },
  { x: 65.3, y: 51 },
  { x: 82.7, y: 51 },
];

export const moduleMeta = {
  id: "tas-siaga-72-jam",
  number: "08",
  navLabel: "Preparation Phase",
  title: "72 Hours Emergency Bag",
  icon: tasItem,
  image: bagBoard,
  posterStyle: {
    "--quest-poster-width": "min(96%, 500px)",
    "--quest-poster-max-height": "min(6784px, 27vh)",
    "--quest-poster-offset-y": "20px",
  },
  headerImage: head72Jam,
  subtitle: "Persiapkan tas siaga untuk kebutuhan darurat selama 72 jam",
  pageTitle: "Paket Final Siaga",
  pageSubtitle: "Seret item inventory ke tas 72 jam.",
  description: "Susun item hasil modul sebelumnya ke dalam tas 72 jam. Jika paket belum lengkap, simulasi akhir tetap terkunci.",
  bookLayout: "split-comic",
  leftPosterOnly: true,
  hideTip: true,
  rewards: [],
  tip: "Tas siaga adalah gerbang final. Isi tas menjadi perlengkapan yang dipakai dalam scene akhir.",
  gameplay: {
    type: "backpack",
    label: "Preparation Phase",
    requiredActions: requiredBagKeys,
    weightLimit: 20,
    slots: bagItems,
    bagTargets,
    leftTitle: "Inventory Bag",
    leftText: "Seret item dari inventory ke tas siaga 72 jam.",
  },
};

const Module08EmergencyBagPage = ({
  gameplay,
  earnedInventoryKeys = new Set(),
  inventoryItems = [],
  bagItemKeys = [],
  toggleBagItem,
  placement = "default",
}) => {
  const [inventoryPage, setInventoryPage] = useState(0);
  const [draggedKey, setDraggedKey] = useState("");
  const [selectedItemKey, setSelectedItemKey] = useState("");
  const [placedBagItems, setPlacedBagItems] = useState({});
  const unlockedInventoryKeys = earnedInventoryKeys instanceof Set ? earnedInventoryKeys : new Set(earnedInventoryKeys);
  const slotByKey = useMemo(() => new Map(gameplay.slots.map((slot) => [slot.key, slot])), [gameplay.slots]);
  const inventoryPool = gameplay.slots.filter((slot) => {
    const inventoryMatch = inventoryItems.find((item) => item.key === slot.key);

    return inventoryMatch && unlockedInventoryKeys.has(slot.key) && !bagItemKeys.includes(slot.key);
  });
  const pageCount = Math.max(1, Math.ceil(inventoryPool.length / 5));
  const safePage = Math.min(inventoryPage, pageCount - 1);
  const visibleInventory = inventoryPool.slice(safePage * 5, safePage * 5 + 5);
  const completedRequired = gameplay.requiredActions.filter((key) => bagItemKeys.includes(key)).length;
  const isBagComplete = gameplay.requiredActions.every((key) => bagItemKeys.includes(key));
  const missionImage = isBagComplete ? missionEndBoard : missionBoard;

  useEffect(() => {
    setPlacedBagItems((current) => {
      const next = { ...current };
      let changed = false;

      Object.entries(next).forEach(([targetId, itemKey]) => {
        if (!bagItemKeys.includes(itemKey)) {
          delete next[targetId];
          changed = true;
        }
      });

      bagItemKeys.forEach((itemKey) => {
        if (Object.values(next).includes(itemKey)) {
          return;
        }

        const emptyTarget = gameplay.bagTargets.find((target) => !next[target.id]);
        if (emptyTarget) {
          next[emptyTarget.id] = itemKey;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [bagItemKeys, gameplay.bagTargets]);

  const movePage = (direction) => {
    setInventoryPage((current) => (current + direction + pageCount) % pageCount);
  };

  const addBagItem = (slot) => {
    if (!slot || bagItemKeys.includes(slot.key)) {
      return;
    }

    toggleBagItem(slot);
  };

  const placeItemInTarget = (targetId, itemKey) => {
    const item = slotByKey.get(itemKey);

    if (!item) {
      return;
    }

    const previousItemKey = placedBagItems[targetId];

    if (previousItemKey && previousItemKey !== itemKey && bagItemKeys.includes(previousItemKey)) {
      toggleBagItem(slotByKey.get(previousItemKey));
    }

    setPlacedBagItems((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([id, key]) => id !== targetId && key !== itemKey)),
      [targetId]: itemKey,
    }));
    addBagItem(item);
    setSelectedItemKey("");
  };

  const removePlacedItem = (targetId, itemKey) => {
    setPlacedBagItems((current) => {
      const next = { ...current };
      delete next[targetId];
      return next;
    });

    if (bagItemKeys.includes(itemKey)) {
      toggleBagItem(slotByKey.get(itemKey));
    }
  };

  const handleSlotDrop = (targetId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const key = event.dataTransfer.getData("text/plain") || draggedKey;

    placeItemInTarget(targetId, key);
    setDraggedKey("");
  };

  if (placement === "left") {
    return (
      <section className="quest-gameplay quest-gameplay--module08 quest-gameplay--module08-left">
        <figure
          className={isBagComplete ? "quest-module08-bag is-complete" : "quest-module08-bag"}
          onDragOver={(event) => event.preventDefault()}
        >
          <img src={bagBoard} alt="" />
          {gameplay.bagTargets.map((target) => {
            const placedItem = slotByKey.get(placedBagItems[target.id]);

            return (
              <button
                key={target.id}
                type="button"
                className={placedItem ? "quest-module08-bag-slot is-filled" : "quest-module08-bag-slot"}
                style={{
                  "--module08-slot-x": target.x,
                  "--module08-slot-y": target.y,
                  "--module08-slot-w": target.w,
                  "--module08-slot-h": target.h,
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleSlotDrop(target.id, event)}
                onClick={() => {
                  if (placedItem) {
                    removePlacedItem(target.id, placedItem.key);
                    return;
                  }

                  if (selectedItemKey) {
                    placeItemInTarget(target.id, selectedItemKey);
                  }
                }}
                aria-label={placedItem ? `${target.label} berisi ${placedItem.label}` : `${target.label} kosong`}
              >
                {placedItem ? <img src={placedItem.icon} alt="" /> : null}
              </button>
            );
          })}
        </figure>

        <div className="quest-module08-inventory-wrap">
          <button className="quest-module08-arrow" type="button" onClick={() => movePage(1)} aria-label="Inventory berikutnya">{"<"}</button>
          <figure className="quest-module08-inventory">
            <img src={inventoryBoard} alt="" />
            {visibleInventory.map((slot, index) => (
              <button
                key={slot.key}
                type="button"
                className={selectedItemKey === slot.key ? "quest-module08-inventory-item is-selected" : "quest-module08-inventory-item"}
                draggable
                style={{ "--module08-x": `${inventorySlots[index].x}%`, "--module08-y": `${inventorySlots[index].y}%` }}
                onClick={() => setSelectedItemKey((current) => (current === slot.key ? "" : slot.key))}
                onDragStart={(event) => {
                  setDraggedKey(slot.key);
                  setSelectedItemKey(slot.key);
                  event.dataTransfer.setData("text/plain", slot.key);
                }}
                onDragEnd={() => setDraggedKey("")}
                aria-label={`Pilih ${slot.label}`}
              >
                <img src={slot.icon} alt="" />
              </button>
            ))}
          </figure>
          <button className="quest-module08-arrow" type="button" onClick={() => movePage(-1)} aria-label="Inventory sebelumnya">{">"}</button>
        </div>
      </section>
    );
  }

  return (
    <section className="quest-gameplay quest-gameplay--module08 quest-gameplay--module08-right">
      <img className="quest-module08-material" src={materialBoard} alt="" />
      <img className="quest-module08-mission" src={missionImage} alt="" />
      <p className={isBagComplete ? "quest-module08-progress-text is-complete" : "quest-module08-progress-text"}>
        {completedRequired} / {gameplay.requiredActions.length} item utama masuk ke tas
      </p>
    </section>
  );
};

export default Module08EmergencyBagPage;
