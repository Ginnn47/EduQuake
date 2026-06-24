const EduQuakeObjectivePanel = ({ objective, status, onMinimize }) => {
  if (!objective && !status) {
    return null;
  }

  const tasks = Array.isArray(objective?.tasks) ? objective.tasks.slice(0, 5) : [];

  return (
    <aside className="eduquake-objective-panel" aria-label="Objective simulasi">
      <header>
        <span>{objective?.act || "EduQuake"}</span>
        <button type="button" onClick={onMinimize} aria-label="Minimize task">
          -
        </button>
      </header>
      <strong>{objective?.title || "Objective"}</strong>
      {status ? <p className="eduquake-objective-panel__status">{status}</p> : null}
      {tasks.length ? (
        <ul>
          {tasks.map((task, index) => (
            <li key={`${task.label}-${index}`} className={task.done ? "is-done" : ""}>
              <i aria-hidden="true" />
              <span>{task.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {objective?.progressText ? <em>{objective.progressText}</em> : null}
    </aside>
  );
};

export default EduQuakeObjectivePanel;
