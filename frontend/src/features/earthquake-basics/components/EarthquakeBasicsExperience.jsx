import { useState } from "react";
import { useJourney } from "../../../context/JourneyContext";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const hotspots = [
  {
    id: "chalkboard",
    title: "Animated Chalkboard",
    body: "Gempa terjadi ketika energi di kerak bumi terlepas dan mengirim gelombang seismik.",
  },
  {
    id: "globe",
    title: "Seismic Globe",
    body: "Yogyakarta perlu membaca risiko lokal bersama struktur bangunan dan jalur evakuasi.",
  },
  {
    id: "dust",
    title: "Dust Particles",
    body: "Debu dan benda jatuh adalah tanda untuk segera lindungi kepala.",
  },
];

const EarthquakeBasicsExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();
  const [opened, setOpened] = useState([]);

  const toggle = (id) => {
    setOpened((current) => current.includes(id) ? current : [...current, id]);
  };

  const done = opened.length === hotspots.length;

  return (
    <PixelPanel title="Earthquake Basics" kicker={zone.biome}>
      <div className="zone-learning-grid">
        <div className="zone-scene">
          <img src={zone.image} alt="" />
          <button className="scene-hotspot scene-hotspot--board" onClick={() => toggle("chalkboard")}>?</button>
          <button className="scene-hotspot scene-hotspot--globe" onClick={() => toggle("globe")}>?</button>
          <button className="scene-hotspot scene-hotspot--dust" onClick={() => toggle("dust")}>?</button>
        </div>
        <div className="hotspot-list">
          {hotspots.map((hotspot) => (
            <article key={hotspot.id} className={opened.includes(hotspot.id) ? "is-open" : ""}>
              <h4>{hotspot.title}</h4>
              <p>{opened.includes(hotspot.id) ? hotspot.body : "Temukan hotspot di kelas untuk membuka catatan."}</p>
            </article>
          ))}
          <div className="zone-actions">
            <PixelButton variant="secondary" onClick={() => recordDiscovery(zone.id)}>Find Knowledge Book</PixelButton>
            <PixelButton icon="OK" onClick={() => completeZone(zone.id)} disabled={!done}>Finish Tutorial</PixelButton>
          </div>
        </div>
      </div>
    </PixelPanel>
  );
};

export default EarthquakeBasicsExperience;
