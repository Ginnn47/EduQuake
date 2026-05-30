import DashboardPage from "../pages/DashboardPage";
import FinalSimulationPlayPage from "../pages/FinalSimulationPlayPage";

const Router = () => {
  const path = window.location.pathname;

  if (path === "/final-simulation" || path === "/simulasi-akhir") {
    return <FinalSimulationPlayPage />;
  }

  return <DashboardPage />;
};

export default Router;
