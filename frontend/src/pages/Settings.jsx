import { useAudio } from "../context/AudioContext";
import PixelButton from "../components/ui/PixelButton";
import PixelPanel from "../components/ui/PixelPanel";

const Settings = () => {
  const { soundEnabled, toggleSound } = useAudio();
  return (
    <PixelPanel title="Settings" kicker="System">
      <PixelButton onClick={toggleSound}>{soundEnabled ? "Mute Audio" : "Enable Audio"}</PixelButton>
    </PixelPanel>
  );
};

export default Settings;
