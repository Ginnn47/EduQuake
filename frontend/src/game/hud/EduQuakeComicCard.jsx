const EduQuakeComicCard = ({ comic, onMinimize }) => {
  if (!comic) {
    return null;
  }

  return (
    <section className="eduquake-comic-card" aria-label={comic.title || "Komik EduQuake"}>
      <header>
        <button type="button" onClick={onMinimize} aria-label="Minimize komik">
          -
        </button>
        <strong>{comic.title || "Komik EduQuake"}</strong>
        <span>{comic.subtitle || "Simulasi"}</span>
      </header>
      {comic.description ? <p>{comic.description}</p> : null}
      {comic.image ? (
        <figure>
          <img src={comic.image} alt="" />
        </figure>
      ) : null}
    </section>
  );
};

export default EduQuakeComicCard;
