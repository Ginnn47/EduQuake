export const smoothPanTo = (current, target, factor = 0.18) => ({
  x: current.x + (target.x - current.x) * factor,
  y: current.y + (target.y - current.y) * factor,
});
