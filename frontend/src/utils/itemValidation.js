export const hasRequiredKitItems = (items, requiredItems) => {
  return requiredItems.every((item) => items.includes(item.id));
};
