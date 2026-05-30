const tones = {
  select: { frequency: 520, duration: 0.08, type: "square" },
  open: { frequency: 360, duration: 0.12, type: "triangle" },
  unlock: { frequency: 740, duration: 0.18, type: "sine" },
  levelUp: { frequency: 920, duration: 0.22, type: "sine" },
  alert: { frequency: 180, duration: 0.28, type: "sawtooth" },
};

let audioContext;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
};

export const playSfx = (name, enabled = true) => {
  if (!enabled) return;
  const config = tones[name] ?? tones.select;
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, context.currentTime);
  gain.gain.setValueAtTime(0.035, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + config.duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + config.duration);
};
