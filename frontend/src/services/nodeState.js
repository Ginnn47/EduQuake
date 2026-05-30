import { getFirstIncompleteZone, isZoneUnlocked } from "./unlockSystem";

export const getZoneState = (zone, completedZoneIds, activeZoneId) => {
  if (!isZoneUnlocked(zone.id, completedZoneIds)) return "locked";
  if (completedZoneIds.includes(zone.id)) return "completed";
  if (zone.id === activeZoneId) return "active";
  if (zone.id === getFirstIncompleteZone(completedZoneIds).id) return "recommended";
  return "default";
};
