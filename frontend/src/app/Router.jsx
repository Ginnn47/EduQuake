import DashboardPage from "../pages/DashboardPage";
import SimulationPage from "../pages/SimulationPage";

const Router = () => {
  const path = window.location.pathname;

  if (path === "/final-simulation" || path === "/simulasi-akhir" || path === "/simulation") {
    return <SimulationPage />;
  }

  return <DashboardPage />;
};

export default Router;
