import { zoneImages } from "../constants/eduquakeAssets";
import { journeyZones } from "../constants/zones";

const WorldMap = () => (
  <section className="world-map">
    <img src={zoneImages.regionMap} alt="" />
    <div className="world-map__nodes">
      {journeyZones.map((zone) => (
        <span key={zone.id} style={{ left: `${zone.map.x}%`, top: `${zone.map.y}%` }}>
          {zone.shortName}
        </span>
      ))}
    </div>
  </section>
);

export default WorldMap;
