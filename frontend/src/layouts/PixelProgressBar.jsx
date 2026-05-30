const PixelProgressBar = ({ label = "Progress", tone = "green", value = 0 }) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`pixel-progress pixel-progress--${tone}`} aria-label={label}>
      <span className="pixel-progress__track">
        <span className="pixel-progress__fill" style={{ width: `${safeValue}%` }} />
      </span>
      <strong>{safeValue}%</strong>
    </div>
  );
};

export default PixelProgressBar;
