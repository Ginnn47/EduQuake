import { journeyZones } from "../constants/zones";

export const getNextZoneId = (zoneId) => {
  const current = journeyZones.find((zone) => zone.id === zoneId);
  if (!current) return journeyZones[0].id;
  return journeyZones.find((zone) => zone.order === current.order + 1)?.id ?? current.id;
};
