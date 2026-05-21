import { useJourney } from "../../../context/JourneyContext";
import EvacuationSimulation from "../../../components/simulation/EvacuationSimulation";
import SurvivalScenario from "../../../components/simulation/SurvivalScenario";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const EvacuationExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();

  return (
    <PixelPanel title="Evacuation & Survival" kicker={zone.biome}>
      <div className="zone-learning-grid">
        <div className="zone-scene zone-scene--evacuation">
          <img src={zone.image} alt="" />
        </div>
        <div>
          <SurvivalScenario title="Safe Shelter Route">
            Ikuti rambu evakuasi, hindari kaca dan kabel, lalu bergerak ke area terbuka atau shelter warga.
          </SurvivalScenario>
          <EvacuationSimulation onComplete={() => completeZone(zone.id)} />
          <PixelButton variant="secondary" size="sm" onClick={() => recordDiscovery(zone.id)}>
            Scan Shelter Marker
          </PixelButton>
        </div>
      </div>
    </PixelPanel>
  );
};

export default EvacuationExperience;
