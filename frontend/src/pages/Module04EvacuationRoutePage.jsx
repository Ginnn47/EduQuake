import { useState } from "react";
import atkItem from "../assets/items/atk-cutout.png";
import headRoute from "../assets/ui/head_rute.png";
import routeMapMain from "../assets/ui/04-mapmain.png";
import routePuzzle from "../assets/ui/04-cutout-clean.png";
import routePiece01 from "../assets/ui/04route/04-route-01-straight-vertical.png";
import routePiece02 from "../assets/ui/04route/04-route-02-straight-horizontal.png";
import routePiece03 from "../assets/ui/04route/04-route-03-corner-ne.png";
import routePiece04 from "../assets/ui/04route/04-route-04-corner-es.png";
import routePiece05 from "../assets/ui/04route/04-route-05-tee-up.png";
import routePiece06 from "../assets/ui/04route/04-route-06-straight-vertical-2.png";
import routePiece07 from "../assets/ui/04route/04-route-07-corner-sw.png";
import routePiece08 from "../assets/ui/04route/04-route-08-corner-wn.png";
import routePiece09 from "../assets/ui/04route/04-route-09-corner-nw.png";
import routePiece10 from "../assets/ui/04route/04-route-10-corner-se.png";
import womanGuideRoute from "../assets/npc/woman2-cutout.png";
import womanGuideRisk from "../assets/npc/woman3-cutout.png";
import { rewardItems } from "./bookRewards";

export const moduleMeta = {
  id: "jalur-evakuasi",
  number: "04",
  navLabel: "Evacuation",
  title: "Evacuation Path",
  icon: atkItem,
  image: routeMapMain,
  // Atur besar/posisi poster modul ini dari sini.
  posterStyle: {
    "--quest-poster-width": "min(98%, 510px)",
    "--quest-poster-offset-y": "-60px",
  },
  headerImage: headRoute,
  subtitle: "Pelajari jalur evakuasi yang aman untuk keluarga",
  pageTitle: "Temukan Jalan yang Tepat !",
  description: "Pelajari titik kumpul, jalur alternatif, dan area terbuka agar keluarga punya arah yang jelas setelah gempa berhenti.",
  leftPosterOnly: true,
  hideTip: true,
  rewards: [rewardItems.alatTulis, rewardItems.dokpenting],
  tip: "Rute terbaik bukan selalu yang paling pendek. Pilih yang paling terbuka, jelas, dan mudah diikuti rombongan.",
  gameplay: {
    type: "map",
    label: "Adventure Map",
    requiredActions: ["safe-route"],
    routes: [
      { id: "route-01", title: "Jalur 01", piece: routePiece01, x: "78.27%", y: "17.08%", w: "6.64%", h: "10.03%" },
      { id: "route-02", title: "Jalur 02", piece: routePiece02, x: "87.54%", y: "17.08%", w: "6.64%", h: "10.03%" },
      { id: "safe-route", title: "Jalur Aman", piece: routePiece03, correct: true, x: "78.27%", y: "32.59%", w: "6.64%", h: "10.03%" },
      { id: "route-04", title: "Jalur 04", piece: routePiece04, x: "87.54%", y: "32.59%", w: "6.64%", h: "10.03%" },
      { id: "route-05", title: "Jalur 05", piece: routePiece05, x: "78.27%", y: "48.28%", w: "6.64%", h: "10.03%" },        { id: "route-06", title: "Jalur 06", piece: routePiece06, x: "87.54%", y: "48.28%", w: "6.64%", h: "10.03%" },
      { id: "route-07", title: "Jalur 07", piece: routePiece07, x: "78.27%", y: "63.97%", w: "6.64%", h: "10.03%" },
      { id: "route-08", title: "Jalur 08", piece: routePiece08, x: "87.54%", y: "63.97%", w: "6.64%", h: "10.03%" },
      { id: "route-09", title: "Jalur 09", piece: routePiece09, x: "78.27%", y: "79.67%", w: "6.64%", h: "10.03%" },
      { id: "route-10", title: "Jalur 10", piece: routePiece10, x: "87.54%", y: "79.67%", w: "6.64%", h: "10.03%" },
    ],
    routeSlots: [
      { id: "slot-01", label: "Slot 01", x: "24.36%", y: "28.13%", w: "5.81%", h: "8.17%" },
      { id: "slot-02", label: "Slot 02", x: "24.36%", y: "44.75%", w: "5.81%", h: "8.17%" },
      { id: "slot-03", label: "Slot 03", x: "41.80%", y: "28.69%", w: "5.40%", h: "7.80%" },
      { id: "slot-04", label: "Slot 04", x: "48.10%", y: "45.40%", w: "5.67%", h: "7.80%" },
    ],
    puzzleImage: routePuzzle,
    leftTitle: "Route Puzzle",
    leftText: "Seret potongan jalur menuju slot kosong untuk membuat rute aman.",
  },
};

const Module04EvacuationRoutePage = ({ module, gameplay, activeDetail, completedActions, markAction, setActiveDetail }) => {
  const [placedRoutes, setPlacedRoutes] = useState({});
  const isRouteComplete = completedActions.includes("safe-route");
  const usedRouteIds = new Set(Object.values(placedRoutes).filter(Boolean));

  const placeRoute = (slotId, routeId) => {
    const route = gameplay.routes.find((item) => item.id === routeId);

    if (!route) {
      return;
    }

    setPlacedRoutes((current) => {
      // Hapus rute dari state jika sebelumnya rute ini diletakkan di slot yang lain
      const withoutDuplicate = Object.fromEntries(
        Object.entries(current).filter(([, currentRouteId]) => currentRouteId !== routeId),
      );
      
      // Masukkan rute ke slot yang baru
      const next = {
        ...withoutDuplicate,
        [slotId]: routeId,
      };

      // --- KUNCI JAWABAN ---
      const correctSequence = {
        "slot-01": "route-09",
        "slot-02": "route-10",
        "slot-03": "route-02",
        "slot-04": "route-05",
      };

      // Cek apakah isi dari 'next' (kondisi puzzle saat ini) 
      // sama persis dengan kunci jawaban (correctSequence)
      const isCorrect = Object.keys(correctSequence).every(
        (slot) => next[slot] === correctSequence[slot]
      );

      // Trigger selesai hanya jika urutan sudah 100% benar
      if (isCorrect) {
        markAction("safe-route", routeId);
      }

      return next;
    });
    
    setActiveDetail(module.id, routeId);
  };
  
  const chooseRoute = (route) => {
    const firstEmptySlot = gameplay.routeSlots.find((slot) => !placedRoutes[slot.id]);

    if (firstEmptySlot) {
      placeRoute(firstEmptySlot.id, route.id);
      return;
    }

    setActiveDetail(module.id, route.id);
  };

  const handleDrop = (slotId, event) => {
    event.preventDefault();
    const routeId = event.dataTransfer.getData("text/plain");

    if (routeId) {
      placeRoute(slotId, routeId);
    }
  };
      // ... kode di atasnya tetap sama

  return (
    /* BUNGKUSAN BARU */
    <div className="quest-module04-wrapper">
      
      <section className="quest-gameplay quest-gameplay--map quest-gameplay--module04">
        <div
          className={["quest-module04-puzzle", isRouteComplete ? "is-complete" : ""].filter(Boolean).join(" ")}
        >
          <img src={gameplay.puzzleImage} alt="" />
          {gameplay.routeSlots.map((slot) => {
            const placedRoute = gameplay.routes.find((route) => route.id === placedRoutes[slot.id]);

            return (
              <button
                key={slot.id}
                type="button"
                className={["quest-module04-dropzone", placedRoute ? "is-filled" : ""].filter(Boolean).join(" ")}
                style={{
                  "--module04-slot-x": slot.x,
                  "--module04-slot-y": slot.y,
                  "--module04-slot-w": slot.w,
                  "--module04-slot-h": slot.h,
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(slot.id, event)}
                onClick={() => {
                  if (placedRoute) {
                    setPlacedRoutes((current) => {
                      const next = { ...current };
                      delete next[slot.id];
                      return next;
                    });
                    setActiveDetail(module.id, slot.id);
                  }
                }}
                aria-label={placedRoute ? `${slot.label} berisi ${placedRoute.title}` : `${slot.label} kosong`}
              >
                {placedRoute?.piece ? <img src={placedRoute.piece} alt="" /> : null}
              </button>
            );
          })}
          {gameplay.routes.map((route) => (
            <button
              key={route.id}
              type="button"
              draggable={!usedRouteIds.has(route.id)}
              className={[
                "quest-module04-route-piece",
                activeDetail === route.id ? "is-selected" : "",
                usedRouteIds.has(route.id) ? "is-used" : "",
              ].filter(Boolean).join(" ")}
              style={{
                "--module04-piece-x": route.x,
                "--module04-piece-y": route.y,
                "--module04-piece-w": route.w,
                "--module04-piece-h": route.h,
              }}
              onDragStart={(event) => {
                if (usedRouteIds.has(route.id)) {
                  event.preventDefault();
                  return;
                }

                event.dataTransfer.setData("text/plain", route.id);
              }}
              onClick={() => chooseRoute(route)}
              aria-label={`Pilih ${route.title}`}
              disabled={usedRouteIds.has(route.id)}
            >
              <img src={route.piece} alt="" />
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Module04EvacuationRoutePage;
