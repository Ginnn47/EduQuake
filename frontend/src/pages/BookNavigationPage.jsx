import { npcSprites, uiAssets } from "../constants/eduquakeAssets";

export const BookTopbar = ({ moduleProgress = 42, moduleProgressText = "500 / 1000 XP" }) => (
  <header className="quest-topbar">
    <a className="quest-brand" href="#beranda" aria-label="EduQuake">
      <img src={uiAssets.logo} alt="" />
      <span>
        <strong>EDUQUAKE</strong>
        <small>PREPAREDNESS RPG</small>
      </span>
    </a>

    <nav className="quest-nav" aria-label="Navigasi utama">
      {["Beranda", "Modul Belajar", "Tentang Kami", "Profil"].map((item) => (
        <a key={item} className={item === "Modul Belajar" ? "is-active" : ""} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
          {item}
        </a>
      ))}
    </nav>

    <section className="quest-player" aria-label="Player HUD">
      <span className="quest-avatar">
        <img src={npcSprites.rescueCommander} alt="" />
      </span>
      <strong>LV. 13</strong>
      <span className="quest-xp">
        <i style={{ width: `${moduleProgress}%` }} />
      </span>
      <span className="quest-xp-text">{moduleProgressText}</span>
      <span className="quest-currency quest-currency--gold"><i />3,300</span>
      <span className="quest-currency quest-currency--gem"><i />240</span>
    </section>
  </header>
);

export const BookSidebar = ({
  modules,
  activeModule,
  completedModuleIds,
  finalUnlocked,
  setActiveModuleId,
  inventoryItems,
  earnedInventoryKeys,
}) => (
  <aside className="quest-sidebar" aria-label="Pilihan modul dan inventory">
    <section className="quest-side-panel">
      <h2>Sidebar Progress</h2>
      <p className="quest-drawer-hint">Arahkan cursor ke tab kiri untuk membuka progres modul.</p>
      <nav className="quest-module-list" aria-label="Pilih modul belajar">
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={[
              module.id === activeModule.id ? "is-active" : "",
              completedModuleIds.has(module.id) ? "is-complete" : "",
              module.id === "simulasi-akhir" && !finalUnlocked ? "is-locked" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setActiveModuleId(module.id)}
          >
            <i aria-hidden="true">{Number(module.number)}</i>
            <span>{module.navLabel}</span>
          </button>
        ))}
      </nav>
      <h3>Inventory</h3>
      <div className="quest-inventory-grid">
        {inventoryItems.map((item) => {
          const isUnlocked = earnedInventoryKeys.has(item.key);

          return (
            <button
              key={item.key}
              type="button"
              className={isUnlocked ? "is-unlocked" : "is-locked"}
              aria-label={`${item.label} ${isUnlocked ? "terbuka" : "terkunci"}`}
            >
              <img src={item.icon} alt="" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  </aside>
);

const BookNavigationPage = (props) => (
  <>
    <BookTopbar {...props.playerHud} />
    <BookSidebar {...props} />
  </>
);

export default BookNavigationPage;
