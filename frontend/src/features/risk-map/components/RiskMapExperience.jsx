import { useState } from "react";
import { riskHotspots } from "../../../data/facts/riskHotspots";
import { useJourney } from "../../../context/JourneyContext";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const RiskMapExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();
  const [selected, setSelected] = useState(riskHotspots[0]);
  const [visited, setVisited] = useState([riskHotspots[0].id]);

  const select = (hotspot) => {
    setSelected(hotspot);
    setVisited((current) => current.includes(hotspot.id) ? current : [...current, hotspot.id]);
  };

  return (
    <PixelPanel title="Yogyakarta Risk Map" kicker={zone.biome}>
      <div className="risk-map-zone">
        <div className="risk-map-canvas">
          <img src={zone.image} alt="" />
          {riskHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className="risk-marker"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, "--marker-color": hotspot.color }}
              onClick={() => select(hotspot)}
            >
              {hotspot.name}
            </button>
          ))}
        </div>
        <aside className="risk-detail">
          <img src={selected.map} alt="" />
          <p className="pixel-kicker">Risk {selected.risk}</p>
          <h3>{selected.name}</h3>
          <p>{selected.story}</p>
          <div className="zone-actions">
            <PixelButton variant="secondary" onClick={() => recordDiscovery(zone.id)}>Read Historical Sign</PixelButton>
            <PixelButton icon="OK" onClick={() => completeZone(zone.id)} disabled={visited.length < riskHotspots.length}>
              Confirm Local Awareness
            </PixelButton>
          </div>
        </aside>
      </div>
    </PixelPanel>
  );
};

export default RiskMapExperience;
