export const getZoneFocusOffset = (zone) => {
  if (!zone?.map) return { x: 0, y: 0 };
  return {
    x: (50 - zone.map.x) * 1.2,
    y: (48 - zone.map.y) * 0.9,
  };
};
