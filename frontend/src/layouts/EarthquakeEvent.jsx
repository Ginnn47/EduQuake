import PixelButton from "./PixelButton";

const drillSteps = ["Drop", "Cover", "Hold"];

const EarthquakeEvent = ({ onComplete }) => (
  <article className="scenario-card">
    <h3>Drop, Cover, Hold</h3>
    <ol>
      {drillSteps.map((step) => <li key={step}>{step}</li>)}
    </ol>
    <PixelButton icon="OK" onClick={onComplete}>Complete Drill</PixelButton>
  </article>
);

export default EarthquakeEvent;
