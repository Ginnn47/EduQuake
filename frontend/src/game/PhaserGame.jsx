import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ClassroomScene from "./scenes/ClassroomScene";
import EduQuakeHudOverlay from "./hud/EduQuakeHudOverlay";

const TOUCH_DIRECTIONS = [
  { direction: "up", label: "Atas", symbol: "^" },
  { direction: "left", label: "Kiri", symbol: "<" },
  { direction: "right", label: "Kanan", symbol: ">" },
  { direction: "down", label: "Bawah", symbol: "v" },
];

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

const getViewportSize = () => {
  if (typeof window === "undefined") {
    return { width: 1280, height: 720 };
  }

  const viewport = window.visualViewport;
  const width = viewport?.width ?? window.innerWidth ?? document.documentElement.clientWidth;
  const height = viewport?.height ?? window.innerHeight ?? document.documentElement.clientHeight;

  return {
    width: Math.max(320, Math.round(width)),
    height: Math.max(320, Math.round(height)),
  };
};

const ensureEduQuakeKeyState = () => {
  if (typeof window === "undefined") {
    return createEduQuakeKeyState();
  }

  if (!window.__EDUQUAKE_KEYS) {
    window.__EDUQUAKE_KEYS = createEduQuakeKeyState();
  }

  return window.__EDUQUAKE_KEYS;
};

const PhaserGame = () => {
  const hostRef = useRef(null);
  const gameRef = useRef(null);

  const focusGame = () => {
    if (!gameRef.current?.canvas) {
      return;
    }

    gameRef.current.canvas.setAttribute("tabindex", "0");
    gameRef.current.canvas.focus();
  };

  const setTouchDirection = (direction, isPressed) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPressed && typeof event.currentTarget.setPointerCapture === "function" && event.pointerId !== undefined) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    const keys = ensureEduQuakeKeyState();
    keys[direction] = isPressed;
    focusGame();
  };

  const queueTouchAction = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const keys = ensureEduQuakeKeyState();
    keys.actionQueued = true;
    focusGame();
  };

  useEffect(() => {
    if (!hostRef.current || gameRef.current) {
      return undefined;
    }

    Object.assign(ensureEduQuakeKeyState(), createEduQuakeKeyState());
    const viewportSize = getViewportSize();

    const config = {
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: viewportSize.width,
      height: viewportSize.height,
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
      const size = getViewportSize();
      gameRef.current?.scale.resize(size.width, size.height);
    };

    const visualViewport = window.visualViewport;

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    window.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    document.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    document.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    window.addEventListener("blur", clearKeys);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      window.removeEventListener("blur", clearKeys);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleResize);
      clearKeys();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <section
      className="final-simulation-game-shell final-simulation-game-shell--runtime"
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        ref={hostRef}
        onPointerDown={() => gameRef.current?.canvas?.focus()}
        className="final-simulation-canvas"
      />
      <EduQuakeHudOverlay />
      <div className="eduquake-touch-controls" aria-label="Kontrol sentuh simulasi">
        <div className="eduquake-touch-dpad" aria-label="Kontrol arah">
          {TOUCH_DIRECTIONS.map(({ direction, label, symbol }) => (
            <button
              key={direction}
              type="button"
              className={`eduquake-touch-control eduquake-touch-control--${direction}`}
              aria-label={`Gerak ${label}`}
              onPointerDown={setTouchDirection(direction, true)}
              onPointerUp={setTouchDirection(direction, false)}
              onPointerCancel={setTouchDirection(direction, false)}
              onPointerLeave={setTouchDirection(direction, false)}
            >
              {symbol}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="eduquake-touch-control eduquake-touch-action"
          aria-label="Aksi"
          onPointerDown={queueTouchAction}
        >
          E
        </button>
      </div>
    </section>
  );
};

export default PhaserGame;
