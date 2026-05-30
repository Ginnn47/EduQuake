const SurvivalScenario = ({ children, title }) => (
  <article className="scenario-card scenario-card--quiet">
    <h3>{title}</h3>
    <p>{children}</p>
  </article>
);

export default SurvivalScenario;
