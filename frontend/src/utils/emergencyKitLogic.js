export const getKitCompletionPercent = (items, requiredItems) => {
  return Math.round((items.length / requiredItems.length) * 100);
};
