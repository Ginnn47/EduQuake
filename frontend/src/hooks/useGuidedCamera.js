import { useCallback, useEffect, useRef, useState } from "react";
import { applyCameraDrag } from "../utils/dragController";
import { getZoneFocusOffset } from "../utils/zoneFocus";

const useGuidedCamera = (zone) => {
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const [pan, setPan] = useState(() => getZoneFocusOffset(zone));

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPan(getZoneFocusOffset(zone));
    });
    return () => cancelAnimationFrame(frame);
  }, [zone]);

  const onPointerDown = useCallback((event) => {
    if (event.pointerType === "touch") return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setPan((current) => applyCameraDrag(current, dx, dy));
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
  }, []);

  const onPointerUp = useCallback((event) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return {
    pan,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
};

export default useGuidedCamera;
