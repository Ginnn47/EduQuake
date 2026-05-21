/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { journeyZones, zoneById } from "../data/zones/zones";
import { getNextZoneId } from "../systems/route/progressionFlow";
import { loadSave, persistSave } from "../systems/save/saveManager";
import { calculateCoins, calculateJourneyProgress, calculateXp } from "../systems/progression/xpSystem";
import { getFirstIncompleteZone, getUnlockedZoneIds, isZoneUnlocked } from "../systems/progression/unlockSystem";
import { getLevelProgress, getPreparednessLevel } from "../systems/progression/levelSystem";
import { getUnlockedBadges } from "../systems/progression/badgeSystem";

const defaultSave = {
  activeZoneId: "command-center",
  completedZoneIds: ["command-center"],
  discoveries: [],
};

const JourneyContext = createContext(null);

export const JourneyProvider = ({ children }) => {
  const [save, setSave] = useState(() => loadSave(defaultSave));

  useEffect(() => {
    persistSave(save);
  }, [save]);

  const xp = useMemo(() => calculateXp(save.completedZoneIds), [save.completedZoneIds]);
  const coins = useMemo(() => calculateCoins(save.completedZoneIds), [save.completedZoneIds]);
  const journeyProgress = useMemo(() => calculateJourneyProgress(save.completedZoneIds), [save.completedZoneIds]);
  const level = useMemo(() => getPreparednessLevel(xp), [xp]);
  const levelProgress = useMemo(() => getLevelProgress(xp), [xp]);
  const unlockedZoneIds = useMemo(() => getUnlockedZoneIds(save.completedZoneIds), [save.completedZoneIds]);
  const firstIncompleteZone = useMemo(() => getFirstIncompleteZone(save.completedZoneIds), [save.completedZoneIds]);
  const unlockedBadges = useMemo(() => getUnlockedBadges(xp), [xp]);

  const setActiveZone = useCallback((zoneId) => {
    setSave((current) => {
      if (!zoneById[zoneId] || !isZoneUnlocked(zoneId, current.completedZoneIds)) return current;
      return { ...current, activeZoneId: zoneId };
    });
  }, []);

  const completeZone = useCallback((zoneId, options = {}) => {
    setSave((current) => {
      const completedZoneIds = current.completedZoneIds.includes(zoneId)
        ? current.completedZoneIds
        : [...current.completedZoneIds, zoneId];
      const nextZoneId = options.stay ? current.activeZoneId : getNextZoneId(zoneId);
      const activeZoneId = isZoneUnlocked(nextZoneId, completedZoneIds) ? nextZoneId : current.activeZoneId;
      return { ...current, completedZoneIds, activeZoneId };
    });
  }, []);

  const recordDiscovery = useCallback((zoneId) => {
    setSave((current) => {
      const discovery = zoneById[zoneId]?.discovery;
      if (!discovery || current.discoveries.includes(discovery)) return current;
      return { ...current, discoveries: [...current.discoveries, discovery] };
    });
  }, []);

  const resetJourney = useCallback(() => setSave(defaultSave), []);

  const value = useMemo(() => ({
    zones: journeyZones,
    activeZone: zoneById[save.activeZoneId] ?? journeyZones[0],
    activeZoneId: save.activeZoneId,
    completedZoneIds: save.completedZoneIds,
    discoveries: save.discoveries,
    unlockedZoneIds,
    firstIncompleteZone,
    xp,
    coins,
    journeyProgress,
    level,
    levelProgress,
    unlockedBadges,
    setActiveZone,
    completeZone,
    recordDiscovery,
    resetJourney,
  }), [
    coins,
    completeZone,
    firstIncompleteZone,
    journeyProgress,
    level,
    levelProgress,
    recordDiscovery,
    resetJourney,
    save.activeZoneId,
    save.completedZoneIds,
    save.discoveries,
    setActiveZone,
    unlockedBadges,
    unlockedZoneIds,
    xp,
  ]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
};

export const useJourney = () => {
  const value = useContext(JourneyContext);
  if (!value) throw new Error("useJourney must be used inside JourneyProvider");
  return value;
};
