import { AudioProvider } from "../context/AudioContext";
import { JourneyProvider } from "../context/JourneyContext";

const Providers = ({ children }) => {
  return (
    <AudioProvider>
      <JourneyProvider>{children}</JourneyProvider>
    </AudioProvider>
  );
};

export default Providers;
