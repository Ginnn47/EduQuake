import { useState } from "react";
import def1 from "../assets/pixel-down/def1-cutout.png";
import def2 from "../assets/pixel-down/def2-cutout.png";
import def3 from "../assets/pixel-down/def3-cutout.png";
import bgMain from "../assets/ui/bgmain.png";
import { BookSidebar, BookTopbar } from "./BookNavigationPage";

const pixelDownFrames = [
  ["Drop", def1],
  ["Cover", def2],
  ["Hold", def3],
];

const AdventureBookHomePage = ({ navigationProps, playerHud, children }) => {
  const [activePixelFrame, setActivePixelFrame] = useState(0);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  return (
    <div id="beranda" className="quest-dashboard" style={{ "--quest-bg-main": `url(${bgMain})` }}>
      <BookTopbar
        {...playerHud}
        modules={navigationProps.modules}
        activeModule={navigationProps.activeModule}
        setActiveModuleId={navigationProps.setActiveModuleId}
        inventoryOpen={isInventoryOpen}
        onInventoryClick={() => setIsInventoryOpen((current) => !current)}
      />

      <main id="modul-belajar" className="quest-stage">
        <span className="quest-drawer-trigger" aria-hidden="true">
          <b>Sidebar Progress</b>
        </span>
        {isInventoryOpen ? (
          <button
            className="quest-inventory-backdrop"
            type="button"
            aria-label="Tutup inventory"
            onClick={() => setIsInventoryOpen(false)}
          />
        ) : null}
        <BookSidebar
          {...navigationProps}
          {...playerHud}
          isInventoryOpen={isInventoryOpen}
          onCloseInventory={() => setIsInventoryOpen(false)}
        />
        {children}
      </main>

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
