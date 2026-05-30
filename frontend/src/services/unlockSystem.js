import { journeyZones } from "../constants/zones";

export const getFirstIncompleteZone = (completedZoneIds) => {
  return journeyZones.find((zone) => !completedZoneIds.includes(zone.id)) ?? journeyZones[journeyZones.length - 1];
};

export const getUnlockedZoneIds = (completedZoneIds) => {
  const firstIncomplete = getFirstIncompleteZone(completedZoneIds);
  return journeyZones
    .filter((zone) => zone.order <= firstIncomplete.order)
    .map((zone) => zone.id);
};

export const isZoneUnlocked = (zoneId, completedZoneIds) => {
  return getUnlockedZoneIds(completedZoneIds).includes(zoneId);
};
