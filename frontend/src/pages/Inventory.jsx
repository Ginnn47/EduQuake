import { emergencyKitItems } from "../data/items/emergencyKit";
import ItemCard from "../components/inventory/ItemCard";
import PixelPanel from "../components/ui/PixelPanel";

const Inventory = () => (
  <PixelPanel title="Inventory" kicker="Emergency Kit">
    <div className="inventory-grid">
      {emergencyKitItems.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  </PixelPanel>
);

export default Inventory;
