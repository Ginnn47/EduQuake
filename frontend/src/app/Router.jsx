import { useEffect, useState } from "react";
import DashboardPage from "../pages/DashboardPage";
import SimulationPage from "../pages/SimulationPage";

const getCurrentPath = () => {
  const browserPath = window.location.pathname.replace(/^\/eduquake/, "") || "/";
  const hashPath = window.location.hash.replace(/^#\/?/, "");
  return hashPath || browserPath.replace(/^\//, "");
};

const Router = () => {
  const [route, setRoute] = useState(() => getCurrentPath());

  useEffect(() => {
    const onLocationChange = () => setRoute(getCurrentPath());
    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  if (route === "final-simulation" || route === "simulasi-akhir" || route === "simulation") {
    return <SimulationPage />;
  }

  return <DashboardPage />;
};

export default Router;