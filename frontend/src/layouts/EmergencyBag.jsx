import PixelProgressBar from "./PixelProgressBar";

const EmergencyBag = ({ collectedItems = [], progress = 0, requiredItems = [] }) => (
  <aside className="emergency-bag">
    <h3>Tas Siaga</h3>
    <PixelProgressBar value={progress} label="Emergency kit progress" tone="orange" />
    <div className="emergency-bag__slots">
      {requiredItems.map((item) => (
        <span key={item.id} className={collectedItems.includes(item.id) ? "is-filled" : ""}>
          <img src={item.sprite} alt="" />
          <small>{item.name}</small>
        </span>
      ))}
    </div>
  </aside>
);

export default EmergencyBag;
