import { useState } from "react";
import { badgeSprites, npcSprites } from "../constants/eduquakeAssets";
import logoPanel from "../assets/pixel-down/lgo-cutout.png";
import inventoryPanel from "../assets/pixel-down/invent-navbar-cutout.png";
import inventoryMainPanel from "../assets/pixel-down/inventmain-cutout.png";

const profileBadges = [
  { key: "badge-aware-citizen", label: "Aware Citizen", icon: badgeSprites.awareCitizen },
  { key: "badge-community-guardian", label: "Community Guardian", icon: badgeSprites.communityGuardian },
  { key: "badge-prepared-resident", label: "Prepared Resident", icon: badgeSprites.preparedResident },
  { key: "badge-survival-ready", label: "Survival Ready", icon: badgeSprites.survivalReady },
];

const navItems = [{ label: "Modul Belajar", href: "#modul-belajar", active: true }];

export const BookTopbar = ({
  modules = [],
  activeModule,
  setActiveModuleId,
  inventoryOpen = false,
  onInventoryClick,
}) => {
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const hasModuleDropdown = modules.length > 0 && typeof setActiveModuleId === "function";

  return (
    <header className="quest-topbar">
      <a className="quest-brand" href="#modul-belajar" aria-label="EduQuake">
        <img src={logoPanel} alt="" />
        <span className="quest-brand__text">
          <strong>EDUQUAKE</strong>
          <small>PREPAREDNESS RPG</small>
        </span>
      </a>

      <nav className="quest-nav" aria-label="Navigasi utama">
        {navItems.map((item) =>
          item.label === "Modul Belajar" && hasModuleDropdown ? (
            <span className="quest-nav__module" key={item.label}>
              <button
                className={`quest-nav__trigger${isModuleMenuOpen ? " is-active" : ""}`}
                type="button"
                aria-expanded={isModuleMenuOpen}
                aria-controls="module-dropdown"
                onClick={() => setIsModuleMenuOpen((current) => !current)}
              >
                {item.label}
              </button>
              {isModuleMenuOpen ? (
                <div className="quest-module-dropdown" id="module-dropdown">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      className={activeModule?.id === module.id ? "is-active" : ""}
                      type="button"
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setIsModuleMenuOpen(false);
                      }}
                    >
                      <small>{module.number}</small>
                      <span>{module.navLabel || module.title}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </span>
          ) : (
            <a key={item.label} className={item.active ? "is-active" : ""} href={item.href}>
              {item.label}
            </a>
          ),
        )}
      </nav>

      <div className="quest-topbar__right">
        <button
          className="quest-inventory-shortcut"
          type="button"
          aria-expanded={inventoryOpen}
          aria-controls="inventory"
          aria-label="Buka inventory"
          onClick={onInventoryClick}
        >
          <img src={inventoryPanel} alt="" />
        </button>
      </div>
    </header>
  );
};

export const BookSidebar = ({
  modules = [],
  inventoryItems,
  earnedInventoryKeys,
  completedModuleIds = new Set(),
  moduleProgress = 42,
  moduleProgressText = "500 / 1000 XP",
  isInventoryOpen = false,
  onCloseInventory,
}) => {
  const earnedProfileBadges = modules.flatMap((module) =>
    completedModuleIds.has(module.id)
      ? module.rewards.filter((reward) => reward.inventory === false)
      : [],
  );
  const earnedBadgeCount = earnedProfileBadges.length;
  const moduleProgressPercent = Math.round(moduleProgress);
  const featuredBadge = earnedProfileBadges[earnedBadgeCount - 1] ?? profileBadges[0];

  return (
    <aside
      id="inventory"
      className={`quest-sidebar quest-inventory-module${isInventoryOpen ? " is-open" : ""}`}
      aria-label="Profile dan inventory"
      aria-hidden={!isInventoryOpen}
    >
      <section
        className="quest-side-panel"
        style={{
          "--inventory-panel-art": `url(${inventoryMainPanel})`,
        }}
      >
        <button className="quest-inventory-close" type="button" aria-label="Tutup inventory" onClick={onCloseInventory}>
          X
        </button>

        <section className="quest-inventory-profile" aria-label="Player profile">
          <span className="quest-avatar">
            <img src={npcSprites.citizen} alt="" />
          </span>
          <span className="quest-player__stats">
            <strong>LV. 13</strong>
            <small>PROGRESS MODUL</small>
            <span className="quest-progress-line">
              <span className="quest-xp" aria-label={moduleProgressText}>
                <i style={{ width: `${moduleProgress}%` }} />
              </span>
              <em>{moduleProgressPercent}%</em>
            </span>
          </span>
          <span
            className={`quest-inventory-badge-feature${earnedBadgeCount ? " is-earned" : " is-locked"}`}
            aria-label={`${featuredBadge.label} ${earnedBadgeCount ? "terbuka" : "terkunci"}`}
          >
            <img src={featuredBadge.icon} alt="" />
          </span>
        </section>

        <div className="quest-inventory-grid">
          {inventoryItems.map((item) => {
            const isUnlocked = earnedInventoryKeys.has(item.key);

            return (
              <button
                key={item.key}
                type="button"
                className={isUnlocked ? "is-unlocked" : "is-locked"}
                data-item-key={item.key}
                aria-label={`${item.label} ${isUnlocked ? "terbuka" : "terkunci"}`}
              >
                {isUnlocked && <img src={item.icon} alt="" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

const BookNavigationPage = (props) => (
  <>
    <BookTopbar {...props.playerHud} />
    <BookSidebar {...props} />
  </>
);

export default BookNavigationPage;
