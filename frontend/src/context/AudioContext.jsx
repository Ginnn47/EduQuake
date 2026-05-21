/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { playSfx } from "../systems/audio/sfxManager";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const play = useCallback((name) => {
    playSfx(name, soundEnabled);
  }, [soundEnabled]);

  const value = useMemo(() => ({
    soundEnabled,
    toggleSound: () => setSoundEnabled((current) => !current),
    play,
  }), [play, soundEnabled]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const value = useContext(AudioContext);
  if (!value) throw new Error("useAudio must be used inside AudioProvider");
  return value;
};
