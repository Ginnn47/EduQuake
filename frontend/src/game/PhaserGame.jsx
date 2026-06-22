import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ClassroomScene from "./scenes/ClassroomScene";

const createEduQuakeKeyState = () => ({
  left: false,
  right: false,
  up: false,
  down: false,
  actionQueued: false,
});

const normalizeMoveKey = (event) => {
  const key = String(event.key || "").toLowerCase();
  const code = event.code;

  if (key === "a" || key === "arrowleft" || code === "KeyA" || code === "ArrowLeft") {
    return "left";
  }
  if (key === "d" || key === "arrowright" || code === "KeyD" || code === "ArrowRight") {
    return "right";
  }
  if (key === "w" || key === "arrowup" || code === "KeyW" || code === "ArrowUp") {
    return "up";
  }
  if (key === "s" || key === "arrowdown" || code === "KeyS" || code === "ArrowDown") {
    return "down";
  }

  return null;
};

const isActionKey = (event) => {
  const key = String(event.key || "").toLowerCase();
  return key === "e" || key === " " || key === "spacebar" || event.code === "KeyE" || event.code === "Space";
};

const PhaserGame = () => {
  const hostRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || gameRef.current) {
      return undefined;
    }

    window.__EDUQUAKE_KEYS = createEduQuakeKeyState();

    const config = {
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#0f0b08",
      pixelArt: true,
      roundPixels: true,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      input: {
        keyboard: {
          target: window,
          capture: true,
        },
      },
      scene: [ClassroomScene],
    };

    gameRef.current = new Phaser.Game(config);

    const focusGame = () => {
      if (!gameRef.current?.canvas) {
        return;
      }

      gameRef.current.canvas.setAttribute("tabindex", "0");
      gameRef.current.canvas.focus();
    };

    window.setTimeout(focusGame, 100);

    const handleKeyDown = (event) => {
      const direction = normalizeMoveKey(event);
      if (direction) {
        event.preventDefault();
        window.__EDUQUAKE_KEYS[direction] = true;
        return;
      }

      if (isActionKey(event)) {
        event.preventDefault();
        window.__EDUQUAKE_KEYS.actionQueued = true;
      }
    };

    const handleKeyUp = (event) => {
      const direction = normalizeMoveKey(event);
      if (!direction) {
        return;
      }

      event.preventDefault();
      window.__EDUQUAKE_KEYS[direction] = false;
    };

    const clearKeys = () => {
      Object.assign(window.__EDUQUAKE_KEYS, createEduQuakeKeyState());
    };

    const handleResize = () => {
      gameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    window.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    document.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    document.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    window.addEventListener("blur", clearKeys);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      window.removeEventListener("blur", clearKeys);
      window.removeEventListener("resize", handleResize);
      clearKeys();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0f0b08",
      }}
    >
      <div
        ref={hostRef}
        onPointerDown={() => gameRef.current?.canvas?.focus()}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </section>
  );
};

export default PhaserGame;
