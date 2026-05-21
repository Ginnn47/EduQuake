import FinalChallenge from "../../../components/quiz/FinalChallenge";
import PixelPanel from "../../../components/ui/PixelPanel";

const FinalChallengeExperience = ({ zone }) => (
  <PixelPanel title="Preparedness Challenge" kicker={zone.biome}>
    <div className="final-zone">
      <img src={zone.image} alt="" className="zone-hero-image" />
      <FinalChallenge />
    </div>
  </PixelPanel>
);

export default FinalChallengeExperience;
