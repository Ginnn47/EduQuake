import ItemCard from "./ItemCard";

const InventoryGrid = ({ collectedIds = [], items = [], onCollect }) => (
  <div className="inventory-grid">
    {items.map((item) => (
      <ItemCard
        key={item.id}
        item={item}
        onCollect={onCollect}
        selected={collectedIds.includes(item.id)}
      />
    ))}
  </div>
);

export default InventoryGrid;
