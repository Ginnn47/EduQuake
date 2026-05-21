import { useJourney } from "../../../context/JourneyContext";
import EarthquakeEvent from "../../../components/simulation/EarthquakeEvent";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const SimulationExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();

  return (
    <PixelPanel title="Earthquake Simulation" kicker={zone.biome}>
      <div className="zone-learning-grid">
        <div className="zone-scene zone-scene--simulation">
          <img src={zone.image} alt="" />
        </div>
        <div>
          <EarthquakeEvent onComplete={() => completeZone(zone.id)} />
          <PixelButton variant="secondary" size="sm" onClick={() => recordDiscovery(zone.id)}>
            Listen Emergency Story
          </PixelButton>
        </div>
      </div>
    </PixelPanel>
  );
};

export default SimulationExperience;
