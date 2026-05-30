import { journeyZones } from "../constants/zones";

export const getRouteSegments = () => {
  return journeyZones.slice(0, -1).map((zone, index) => ({
    id: `${zone.id}-to-${journeyZones[index + 1].id}`,
    from: zone,
    to: journeyZones[index + 1],
  }));
};

export const getRouteState = (segment, completedZoneIds) => {
  if (completedZoneIds.includes(segment.to.id)) return "completed";
  if (completedZoneIds.includes(segment.from.id)) return "active";
  return "locked";
};
