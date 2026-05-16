import LandingPage from "./components/landingpage";

function App() {
  if (window.location.pathname === "/simulation") {
    return <main className="min-h-screen bg-[#fff6e6]" aria-label="Simulation page" />;
  }

  return <LandingPage />;
}

export default App;
