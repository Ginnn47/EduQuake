import { useJourney } from "../context/JourneyContext";
import PixelPanel from "../components/ui/PixelPanel";

const Profile = () => {
  const { level, xp, coins } = useJourney();
  return (
    <PixelPanel title="Profile" kicker="EduQuake Cadet">
      <p>{level.title}</p>
      <p>XP {xp}</p>
      <p>Coins {coins}</p>
    </PixelPanel>
  );
};

export default Profile;
