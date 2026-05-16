import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

const Pulse = ({ x, y }) => (
  <motion.div
    className="pointer-events-none absolute rounded-full border-2 border-[#dc6d2f]/70 bg-[#dc6d2f]/16 shadow-[0_0_44px_rgba(220,109,47,0.22)]"
    style={{ left: x, top: y, width: 80, height: 80 }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 2.8, 5.4], opacity: [0, 0.5, 0] }}
    exit={{ opacity: 0 }}
    transition={{ duration: 3.4, ease: "easeOut" }}
  />
);

const AnimatedCanvasLayer = ({
  width,
  height,
  backgroundImage,
  shakeTrigger,
  pulseFrequency = 1200,
  maxPulses = 14,
  autoShakeMin = 90000,
  autoShakeMax = 180000,
  children,
}) => {
  const [pulses, setPulses] = useState([]);
  const [shake, setShake] = useState(false);

  const shakeAnimation = useMemo(
    () => (shake ? { x: [0, -28, 24, -22, 30, -16, 12, 0], y: [0, 18, -24, 20, -18, 12, -8, 0], rotate: [0, -0.18, 0.16, -0.14, 0.12, 0] } : { x: 0, y: 0, rotate: 0 }),
    [shake],
  );

  const addPulse = useCallback((count = 1) => {
    setPulses((current) => [
      ...current,
      ...Array.from({ length: count }, () => ({
        id: `${Date.now()}-${Math.random()}`,
        x: 240 + Math.random() * Math.max(1, width - 520),
        y: 240 + Math.random() * Math.max(1, height - 520),
      })),
    ].slice(-maxPulses));
  }, [height, maxPulses, width]);

  const triggerShake = useCallback(() => {
    addPulse(5);
    setShake(true);
    window.setTimeout(() => setShake(false), 820);
  }, [addPulse]);

  useEffect(() => {
    const interval = setInterval(() => {
      addPulse(1);
    }, pulseFrequency);

    return () => clearInterval(interval);
  }, [addPulse, pulseFrequency]);

  useEffect(() => {
    if (!shakeTrigger) return;
    const frame = requestAnimationFrame(triggerShake);
    return () => cancelAnimationFrame(frame);
  }, [shakeTrigger, triggerShake]);

  useEffect(() => {
    let timeout;
    const schedule = () => {
      const delay = autoShakeMin + Math.random() * Math.max(0, autoShakeMax - autoShakeMin);
      timeout = window.setTimeout(() => {
        triggerShake();
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, [autoShakeMax, autoShakeMin, triggerShake]);

  return (
    <motion.div
      className="absolute left-0 top-0 overflow-hidden"
      style={{
        width,
        height,
        backgroundImage,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      animate={shakeAnimation}
      transition={{ duration: 0.82, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence>
          {pulses.map((pulse) => (
            <Pulse key={pulse.id} x={pulse.x} y={pulse.y} />
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-10">{children}</div>
    </motion.div>
  );
};

export default AnimatedCanvasLayer;
