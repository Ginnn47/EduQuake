export const addItemToInventory = (items, itemId) => {
  return items.includes(itemId) ? items : [...items, itemId];
};
