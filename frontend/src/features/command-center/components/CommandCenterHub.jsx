import { npcSprites } from "../../../assets/eduquakeAssets";
import { useJourney } from "../../../context/JourneyContext";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";
import PixelProgressBar from "../../../components/ui/PixelProgressBar";

const CommandCenterHub = ({ zone }) => {
  const { level, journeyProgress, setActiveZone, completeZone } = useJourney();

  const startJourney = () => {
    completeZone("command-center");
    setActiveZone("earthquake-basics");
  };

  return (
    <PixelPanel title="Command Center" kicker="Save hub">
      <div className="command-center">
        <img src={zone.image} alt="" className="zone-hero-image" />
        <div className="command-console">
          <img src={npcSprites.professorQuake} alt="" className="command-console__sprite" />
          <div className="command-console__main">
            <p className="pixel-kicker">Preparedness Level</p>
            <h3>{level.title}</h3>
            <PixelProgressBar value={journeyProgress} label="Overall journey progress" tone="orange" />
            <PixelButton icon=">" onClick={startJourney}>Start Journey</PixelButton>
          </div>
        </div>
        <div className="command-menu">
          {[
            ["Quiz", "final-challenge"],
            ["Profile", "command-center"],
            ["Map", "risk-map"],
            ["Settings", "command-center"],
          ].map(([label, zoneId]) => (
            <PixelButton key={label} variant="secondary" size="sm" onClick={() => setActiveZone(zoneId)}>
              {label}
            </PixelButton>
          ))}
        </div>
      </div>
    </PixelPanel>
  );
};

export default CommandCenterHub;
