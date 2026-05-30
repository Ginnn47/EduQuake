import { useMemo, useState } from "react";
import PixelButton from "./PixelButton";

const hazards = ["Rak tinggi", "Kaca dekat jalur keluar", "Tabung gas", "Kabel menjuntai"];

const HazardDetection = ({ onComplete }) => {
  const [checked, setChecked] = useState([]);
  const complete = checked.length === hazards.length;

  const toggle = (hazard) => {
    setChecked((current) => (
      current.includes(hazard)
        ? current.filter((item) => item !== hazard)
        : [...current, hazard]
    ));
  };

  const status = useMemo(() => `${checked.length}/${hazards.length}`, [checked.length]);

  return (
    <div className="hazard-checklist">
      {hazards.map((hazard) => (
        <label key={hazard}>
          <input type="checkbox" checked={checked.includes(hazard)} onChange={() => toggle(hazard)} />
          <span>{hazard}</span>
        </label>
      ))}
      <PixelButton disabled={!complete} icon="OK" onClick={onComplete}>Secure Home ({status})</PixelButton>
    </div>
  );
};

export default HazardDetection;
