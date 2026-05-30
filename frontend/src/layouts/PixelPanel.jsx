const PixelPanel = ({ children, className = "", kicker, title }) => (
  <section className={`pixel-panel ${className}`.trim()}>
    {(title || kicker) ? (
      <header className="pixel-panel__header">
        {kicker ? <p className="pixel-kicker">{kicker}</p> : null}
        {title ? <h2>{title}</h2> : null}
      </header>
    ) : null}
    {children}
  </section>
);

export default PixelPanel;
