import PixelButton from "./PixelButton";

const EvacuationSimulation = ({ onComplete }) => (
  <article className="scenario-card">
    <h3>Evacuation Check</h3>
    <p>Pilih rute terbuka, jauhi kaca, dan lanjut ke titik kumpul.</p>
    <PixelButton icon="OK" onClick={onComplete}>Reach Shelter</PixelButton>
  </article>
);

export default EvacuationSimulation;
