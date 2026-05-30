const PixelButton = ({
  children,
  className = "",
  icon,
  size = "md",
  variant = "primary",
  ...props
}) => (
  <button
    className={`pixel-button pixel-button--${variant} pixel-button--${size} ${className}`.trim()}
    type="button"
    {...props}
  >
    {icon ? <span className="pixel-button__icon">{icon}</span> : null}
    <span>{children}</span>
  </button>
);

export default PixelButton;
