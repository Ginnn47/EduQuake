import { useLayoutEffect, useRef, useState } from "react";
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
  const topbarRef = useRef(null);
  const hasModuleDropdown = modules.length > 0 && typeof setActiveModuleId === "function";

  useLayoutEffect(() => {
    const topbar = topbarRef.current;

    if (!topbar || typeof window === "undefined") {
      return undefined;
    }

    const root = document.documentElement;
    const designWidth = 1448;
    const designHeight = 1086;
    const marginX = 16;
    const marginY = 18;
    const heightOverflowAllowance = 5.85;
    let frameId = 0;

    const updateTopbarMetrics = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const rect = topbar.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewportWidth = Math.floor(viewport?.width ?? window.innerWidth ?? root.clientWidth);
        const viewportHeight = Math.floor(viewport?.height ?? window.innerHeight ?? root.clientHeight);
        const topbarBottom = Math.ceil(rect.bottom);
        const topbarHeight = Math.ceil(rect.height);
        const availableWidth = Math.max(1, viewportWidth - marginX);
        const availableHeight = Math.max(1, viewportHeight - topbarHeight - marginY);
        const widthFitScale = availableWidth / designWidth;
        const relaxedHeightScale = (availableHeight / designHeight) * heightOverflowAllowance;
        const nextScale = Math.min(widthFitScale, relaxedHeightScale, 1);
        const landscapeScale = Number.isFinite(nextScale) ? Math.max(0.1, nextScale) : 1;
        const stageWidth = Math.round(designWidth * landscapeScale);
        const stageHeight = Math.round(designHeight * landscapeScale);

        topbar.style.setProperty("--quest-topbar-bottom", `${topbarBottom}px`);
        topbar.style.setProperty("--quest-topbar-height", `${topbarHeight}px`);
        root.style.setProperty("--quest-topbar-bottom", `${topbarBottom}px`);
        root.style.setProperty("--quest-topbar-height", `${topbarHeight}px`);
        root.style.setProperty("--quest-visual-viewport-width", `${viewportWidth}px`);
        root.style.setProperty("--quest-visual-viewport-height", `${viewportHeight}px`);
        root.style.setProperty("--quest-landscape-scale", landscapeScale.toFixed(4));
        root.style.setProperty("--quest-landscape-stage-width", `${stageWidth}px`);
        root.style.setProperty("--quest-landscape-stage-height", `${stageHeight}px`);
      });
    };

    updateTopbarMetrics();

    const resizeObserver =
      typeof window.ResizeObserver === "function" ? new window.ResizeObserver(updateTopbarMetrics) : null;
    resizeObserver?.observe(topbar);
    window.addEventListener("resize", updateTopbarMetrics);
    window.addEventListener("orientationchange", updateTopbarMetrics);
    window.addEventListener("scroll", updateTopbarMetrics, { passive: true });
    window.visualViewport?.addEventListener("resize", updateTopbarMetrics);
    window.visualViewport?.addEventListener("scroll", updateTopbarMetrics);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateTopbarMetrics);
      window.removeEventListener("orientationchange", updateTopbarMetrics);
      window.removeEventListener("scroll", updateTopbarMetrics);
      window.visualViewport?.removeEventListener("resize", updateTopbarMetrics);
      window.visualViewport?.removeEventListener("scroll", updateTopbarMetrics);
      root.style.removeProperty("--quest-topbar-bottom");
      root.style.removeProperty("--quest-topbar-height");
      root.style.removeProperty("--quest-visual-viewport-width");
      root.style.removeProperty("--quest-visual-viewport-height");
      root.style.removeProperty("--quest-landscape-scale");
      root.style.removeProperty("--quest-landscape-stage-width");
      root.style.removeProperty("--quest-landscape-stage-height");
    };
  }, []);

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
        <button
          className="quest-inventory-close"
          type="button"
          aria-label="Tutup inventory"
          onClick={onCloseInventory}
          tabIndex={isInventoryOpen ? 0 : -1}
        >
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
                tabIndex={isInventoryOpen ? 0 : -1}
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
