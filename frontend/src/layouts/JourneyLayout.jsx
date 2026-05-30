import PixelHUD from "./PixelHUD";

const JourneyLayout = ({ sidebar, map, workspace, mission }) => (
  <div className="eduquake-shell">
    <PixelHUD />
    <div className="eduquake-layout">
      {sidebar}
      <main className="eduquake-main">
        {map}
        {workspace}
      </main>
      {mission}
    </div>
  </div>
);

export default JourneyLayout;
