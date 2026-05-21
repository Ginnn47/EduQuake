import { journeyZones } from "../../data/zones/zones";

export const calculateXp = (completedZoneIds) => {
  return journeyZones.reduce((total, zone) => {
    return completedZoneIds.includes(zone.id) ? total + zone.rewards.xp : total;
  }, 0);
};

export const calculateCoins = (completedZoneIds) => {
  return journeyZones.reduce((total, zone) => {
    return completedZoneIds.includes(zone.id) ? total + zone.rewards.coins : total;
  }, 0);
};

export const calculateJourneyProgress = (completedZoneIds) => {
  const playableZones = journeyZones.filter((zone) => zone.id !== "command-center");
  const completedPlayable = playableZones.filter((zone) => completedZoneIds.includes(zone.id));
  return Math.round((completedPlayable.length / playableZones.length) * 100);
};
