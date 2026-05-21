import { useMemo, useState } from "react";
import { emergencyKitItems } from "../../../data/items/emergencyKit";
import { useJourney } from "../../../context/JourneyContext";
import { addItemToInventory } from "../../../systems/inventory/inventoryManager";
import { getKitCompletionPercent } from "../../../systems/inventory/emergencyKitLogic";
import { hasRequiredKitItems } from "../../../systems/inventory/itemValidation";
import EmergencyBag from "../../../components/inventory/EmergencyBag";
import InventoryGrid from "../../../components/inventory/InventoryGrid";
import PixelButton from "../../../components/ui/PixelButton";
import PixelPanel from "../../../components/ui/PixelPanel";

const EmergencyKitExperience = ({ zone }) => {
  const { completeZone, recordDiscovery } = useJourney();
  const [collected, setCollected] = useState([]);
  const progress = useMemo(() => getKitCompletionPercent(collected, emergencyKitItems), [collected]);
  const complete = hasRequiredKitItems(collected, emergencyKitItems);

  const collect = (itemId) => setCollected((current) => addItemToInventory(current, itemId));

  return (
    <PixelPanel title="Emergency Kit" kicker={zone.biome}>
      <div className="kit-zone">
        <div className="kit-zone__scene">
          <img src={zone.image} alt="" />
          <EmergencyBag
            collectedItems={collected}
            requiredItems={emergencyKitItems}
            progress={progress}
            onDropItem={collect}
          />
        </div>
        <div>
          <InventoryGrid items={emergencyKitItems} collectedIds={collected} onCollect={collect} />
          <div className="zone-actions">
            <PixelButton variant="secondary" onClick={() => recordDiscovery(zone.id)}>Open Secret Cache</PixelButton>
            <PixelButton icon="OK" onClick={() => completeZone(zone.id)} disabled={!complete}>Validate Kit</PixelButton>
          </div>
        </div>
      </div>
    </PixelPanel>
  );
};

export default EmergencyKitExperience;
