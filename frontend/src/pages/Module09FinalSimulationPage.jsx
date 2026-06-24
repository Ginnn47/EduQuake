import { useEffect, useState } from "react";
import posterOne from "../assets/ui/09-poster1-clean.png";
import posterTwo from "../assets/ui/09-poster2-clean.png";
import readyBoard from "../assets/ui/09-ready-cutout.png";
import { badgeSprites } from "../constants/eduquakeAssets";
import { rewardItems } from "./bookRewards";

const simulationPosters = [
  { id: "poster-1", image: posterOne, label: "Poster simulasi 1" },
  { id: "poster-2", image: posterTwo, label: "Poster simulasi 2" },
];
const simulationHref = "/#/final-simulation";

export const moduleMeta = {
  id: "simulasi-akhir",
  number: "09",
  navLabel: "Final Simulation",
  title: "Simulasi Akhir",
  icon: badgeSprites.survivalReady,
  image: posterOne,
  bookLayout: "final-simulation",
  hideModuleHeader: true,
  hidePageTitle: true,
  hideTip: true,
  subtitle: "Hari gempa dimulai",
  pageTitle: "",
  description: "Masuki skenario sinematik dan buktikan kesiapsiagaanmu.",
  rewards: [rewardItems.badge4],
  tip: "Ending buruk, normal, good, dan true end bergantung pada kesiapanmu sepanjang campaign.",
  gameplay: {
    type: "finale",
    label: "Cinematic Simulation",
    requiredActions: [],
  },
};

const Module09FinalSimulationPage = ({ placement = "default", isFinalLocked }) => {
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  useEffect(() => {
    if (placement !== "left") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActivePosterIndex((current) => (current + 1) % simulationPosters.length);
    }, 60000);

    return () => window.clearInterval(timer);
  }, [placement]);

  if (placement === "left") {
    return (
      <section className="quest-gameplay quest-gameplay--module09 quest-gameplay--module09-left">
        <figure className="quest-module09-poster-stage" aria-label="Poster simulasi akhir">
          {simulationPosters.map((poster, index) => (
            <img
              key={poster.id}
              src={poster.image}
              alt={poster.label}
              className={index === activePosterIndex ? "is-active" : ""}
            />
          ))}
          <a
            className={isFinalLocked ? "quest-module09-start is-locked" : "quest-module09-start"}
            href={simulationHref}
            aria-label="Mulai simulasi akhir"
          />
        </figure>
      </section>
    );
  }

  if (placement === "right") {
    return (
      <section className="quest-gameplay quest-gameplay--module09 quest-gameplay--module09-right">
        <figure className="quest-module09-ready-stage" aria-label="Alur simulasi akhir">
          <img className="quest-module09-ready" src={readyBoard} alt="Alur simulasi akhir" />
          <a className="quest-module09-ready-start" href={simulationHref} aria-label="Mulai simulasi akhir" />
        </figure>
      </section>
    );
  }

  return null;
};

export default Module09FinalSimulationPage;
