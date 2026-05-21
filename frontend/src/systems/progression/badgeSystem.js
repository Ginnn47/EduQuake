import { preparednessLevels } from "../../data/progression/levels";
import { getPreparednessLevel } from "./levelSystem";

export const getUnlockedBadges = (xp) => {
  return preparednessLevels.filter((level) => level.minXp <= xp);
};

export const getCurrentBadge = (xp) => {
  return getPreparednessLevel(xp).badge;
};
