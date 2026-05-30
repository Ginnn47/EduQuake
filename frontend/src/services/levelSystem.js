import { preparednessLevels } from "../constants/levels";

export const getPreparednessLevel = (xp) => {
  return preparednessLevels.reduce((current, level) => (xp >= level.minXp ? level : current), preparednessLevels[0]);
};

export const getNextPreparednessLevel = (xp) => {
  return preparednessLevels.find((level) => level.minXp > xp) ?? null;
};

export const getLevelProgress = (xp) => {
  const current = getPreparednessLevel(xp);
  const next = getNextPreparednessLevel(xp);
  if (!next) return 100;
  const span = next.minXp - current.minXp;
  return Math.round(((xp - current.minXp) / span) * 100);
};
