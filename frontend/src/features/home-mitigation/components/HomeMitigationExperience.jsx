import { useJourney } from "../../../context/JourneyContext";
import HazardDetection from "../../../components/simulation/HazardDetection";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const HomeMitigationExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();

  return (
    <PixelPanel title="Home Mitigation" kicker={zone.biome}>
      <div className="zone-learning-grid">
        <div className="zone-scene zone-scene--inspection">
          <img src={zone.image} alt="" />
        </div>
        <div>
          <h3>Safety Inspection</h3>
          <p className="system-note">Centang temuan yang sudah diamankan. Simulasi ini menjaga fokus pada benda jatuh, titik aman, dan jalur keluar.</p>
          <HazardDetection onComplete={() => completeZone(zone.id)} />
          <PixelButton variant="secondary" size="sm" onClick={() => recordDiscovery(zone.id)}>
            Claim Preparedness Bonus
          </PixelButton>
        </div>
      </div>
    </PixelPanel>
  );
};

export default HomeMitigationExperience;
