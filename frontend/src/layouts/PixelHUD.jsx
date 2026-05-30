import { useJourney } from "../context/JourneyContext";

const PixelHUD = () => {
  const { coins, journeyProgress, level, xp } = useJourney();

  return (
    <header className="pixel-hud">
      <strong>{level.title}</strong>
      <span>XP {xp}</span>
      <span>Coins {coins}</span>
      <span>{journeyProgress}%</span>
    </header>
  );
};

export default PixelHUD;
