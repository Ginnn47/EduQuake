import { useState } from "react";
import def1 from "../assets/pixel-down/def1-cutout.png";
import def2 from "../assets/pixel-down/def2-cutout.png";
import def3 from "../assets/pixel-down/def3-cutout.png";
import bgMain from "../assets/ui/bgmain.png";
import { npcSprites } from "../constants/eduquakeAssets";
import { BookSidebar, BookTopbar } from "./BookNavigationPage";

const pixelDownFrames = [
  ["Drop", def1],
  ["Cover", def2],
  ["Hold", def3],
];

const leaderboard = [
  ["1.", npcSprites.professorQuake, "Satria", "12,450 XP"],
  ["2.", npcSprites.citizen, "Aulia", "11,230 XP"],
  ["3.", npcSprites.emergencyRanger, "Kirana", "9,870 XP"],
  ["4.", npcSprites.rescueCommander, "Kamu", "7,560 XP"],
];

const AdventureBookHomePage = ({ navigationProps, playerHud, children }) => {
  const [activePixelFrame, setActivePixelFrame] = useState(0);

  return (
    <div className="quest-dashboard" style={{ "--quest-bg-main": `url(${bgMain})` }}>
      <BookTopbar {...playerHud} />

      <main className="quest-stage">
        <span className="quest-drawer-trigger" aria-hidden="true">
          <b>Sidebar Progress</b>
        </span>
        <BookSidebar {...navigationProps} />
        {children}
      </main>

      <section className="quest-leaderboard" aria-label="Leaderboard">
        <h2>Leaderboard</h2>
        <div className="quest-leaderboard__list">
          {leaderboard.map(([rank, avatar, name, score]) => (
            <article key={name} className={name === "Kamu" ? "is-player" : ""}>
              <strong>{rank}</strong>
              <img src={avatar} alt="" />
              <span>{name}</span>
              <small>{score}</small>
            </article>
          ))}
        </div>
        <button type="button">Lihat Semua</button>
      </section>

      <section className="quest-support" aria-label="Bantuan dan kontak">
        <a href="#bantuan">
          <strong>Bantuan</strong>
          <span>Panduan modul dan progres belajar</span>
        </a>
        <a href="#kontak">
          <strong>Kontak</strong>
          <span>Hubungi tim EduQuake</span>
        </a>
      </section>

      <section
        className="quest-pixel-section"
        aria-label="Preview pixel down"
        style={{ "--pixel-frame": `url(${pixelDownFrames[activePixelFrame][1]})` }}
      >
        <div className="quest-pixel-section__triggers" aria-label="Ganti preview pixel">
          {pixelDownFrames.map(([label], index) => (
            <button
              key={label}
              type="button"
              aria-label={`Tampilkan ${label}`}
              className={index === activePixelFrame ? "is-active" : ""}
              onClick={() => setActivePixelFrame(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <figure>
          <img src={pixelDownFrames[activePixelFrame][1]} alt="" />
        </figure>
      </section>
    </div>
  );
};

export default AdventureBookHomePage;
