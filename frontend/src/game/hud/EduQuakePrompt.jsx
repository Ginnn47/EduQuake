const EduQuakePrompt = ({ prompt }) => {
  if (!prompt?.text) {
    return null;
  }

  return (
    <div className="eduquake-interaction-prompt" aria-live="polite">
      {prompt.text}
    </div>
  );
};

export default EduQuakePrompt;
