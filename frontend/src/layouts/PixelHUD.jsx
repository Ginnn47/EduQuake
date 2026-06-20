import { useJourney } from "../context/JourneyContext";
import eduquakeLogo from "../assets/ui/eduquake-logo.png";

const PixelHUD = () => {
  const { coins, journeyProgress, level, xp } = useJourney();

  return (
    <header className="pixel-hud">
      {/* Brand Section */}
      <div className="pixel-hud__brand">
        <img src={eduquakeLogo} alt="Eduquake" className="pixel-hud__logo" />
        <div>
          <strong>{level.title}</strong>
          <span>Level {level.number || "1"}</span>
        </div>
      </div>

      {/* Spacer */}
      <div></div>

      {/* XP Section */}
      <div className="pixel-hud__stat pixel-hud__xp">
        <span>EXP</span>
        <strong>{xp}</strong>
      </div>

      {/* Coins Section */}
      <div className="pixel-hud__stat pixel-hud__coins">
        <span>Coins</span>
        <strong>💰 {coins}</strong>
      </div>

      {/* Progress Section */}
      <div className="pixel-hud__stat">
        <span>Progress</span>
        <strong>{journeyProgress}%</strong>
      </div>

      {/* Empty spacer for grid alignment */}
      <div></div>
    </header>
  );
};

export default PixelHUD;
