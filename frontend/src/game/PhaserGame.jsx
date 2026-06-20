import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ClassroomScene from "./scenes/ClassroomScene";

const normalizeMoveKey = (event) => {
  const key = event.key.toLowerCase();
  const code = event.code;

  if (key === "arrowleft" || key === "a" || code === "ArrowLeft" || code === "KeyA") {
    return "left";
  }
  if (key === "arrowright" || key === "d" || code === "ArrowRight" || code === "KeyD") {
    return "right";
  }
  if (key === "arrowup" || key === "w" || code === "ArrowUp" || code === "KeyW") {
    return "up";
  }
  if (key === "arrowdown" || key === "s" || code === "ArrowDown" || code === "KeyS") {
    return "down";
  }

  return null;
};

const isActionKey = (event) => {
  const key = event.key.toLowerCase();
  return key === "e" || key === " " || key === "spacebar" || event.code === "KeyE" || event.code === "Space";
};

const PhaserGame = () => {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const pressedRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    if (!hostRef.current || gameRef.current) {
      return undefined;
    }

    const getHostSize = () => ({
      width: hostRef.current?.clientWidth || window.innerWidth,
      height: hostRef.current?.clientHeight || window.innerHeight,
    });
    const initialSize = getHostSize();

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: initialSize.width,
      height: initialSize.height,
      parent: hostRef.current,
      backgroundColor: "#160f0a",
      pixelArt: true,
      roundPixels: true,
      input: {
        keyboard: {
          target: window,
          capture: true,
        },
      },
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
      scene: [ClassroomScene],
    });

    const resizeObserver = new ResizeObserver(() => {
      const size = getHostSize();
      gameRef.current?.scale.resize(size.width, size.height);
    });
    resizeObserver.observe(hostRef.current);

    return () => {
      resizeObserver.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const getScene = () => gameRef.current?.scene.getScene("ClassroomScene");
    const syncSceneKey = (direction, pressed) => {
      getScene()?.setExternalControl?.(direction, pressed);
    };
    const refreshIdleState = () => {
      Object.entries(pressedRef.current).forEach(([direction, pressed]) => {
        syncSceneKey(direction, pressed);
      });
    };

    const handleKeyDown = (event) => {
      const direction = normalizeMoveKey(event);
      if (direction) {
        event.preventDefault();
        pressedRef.current[direction] = true;
        syncSceneKey(direction, true);
        return;
      }

      if (isActionKey(event)) {
        event.preventDefault();
        getScene()?.queueExternalAction?.();
        return;
      }

      if (event.key === "Escape" || event.code === "Escape") {
        event.preventDefault();
        getScene()?.queueExternalEscape?.();
      }
    };

    const handleKeyUp = (event) => {
      const direction = normalizeMoveKey(event);
      if (!direction) {
        return;
      }

      event.preventDefault();
      pressedRef.current[direction] = false;
      syncSceneKey(direction, false);
      refreshIdleState();
    };

    const clearKeys = () => {
      Object.keys(pressedRef.current).forEach((direction) => {
        pressedRef.current[direction] = false;
        syncSceneKey(direction, false);
      });
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    window.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    document.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    document.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      window.removeEventListener("blur", clearKeys);
    };
  }, []);

  return (
    <section className="final-simulation-game-shell" aria-label="Area game simulasi gempa">
      <div
        className="final-simulation-canvas"
        ref={hostRef}
        tabIndex={0}
        onPointerDown={() => hostRef.current?.focus()}
      />
    </section>
  );
};

export default PhaserGame;
