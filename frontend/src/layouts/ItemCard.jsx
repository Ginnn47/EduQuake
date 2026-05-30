const ItemCard = ({ item, onCollect, selected = false }) => (
  <button
    className={`item-card ${selected ? "is-selected" : ""}`.trim()}
    onClick={() => onCollect?.(item.id)}
    type="button"
  >
    <img src={item.sprite} alt="" />
    <strong>{item.name}</strong>
    <span>{item.detail}</span>
  </button>
);

export default ItemCard;
