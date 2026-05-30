import { clampPan } from "./cameraBounds";

export const applyCameraDrag = (pan, dx, dy) => ({
  x: clampPan(pan.x + dx * 0.18),
  y: clampPan(pan.y + dy * 0.18),
});
