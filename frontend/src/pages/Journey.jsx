import { useMemo, useState } from "react";
import { badgeSprites, itemSprites, npcSprites, uiAssets, zoneImages } from "../assets/eduquakeAssets";

const modules = [
  {
    id: "risk-map",
    icon: itemSprites.documents,
    title: "Peta Risiko",
    description: "Pelajari daerah rawan gempa di sekitarmu.",
    image: zoneImages.riskMap,
  },
  {
    id: "evacuation",
    icon: itemSprites.radio,
    title: "Jalur Evakuasi",
    description: "Temukan jalur evakuasi terdekat dan aman.",
    image: zoneImages.evacuationRoute,
  },
  {
    id: "emergency-kit",
    icon: itemSprites.food,
    title: "Tas Siaga 72 Jam",
    description: "Siapkan tas siaga untuk keadaan darurat.",
    image: zoneImages.inventoryRoom,
  },
  {
    id: "simulation",
    icon: itemSprites.medicine,
    title: "Simulasi Gempa",
    description: "Latihan langkah tepat saat terjadi gempa.",
    image: zoneImages.classroom,
  },
];

const sidebarItems = [
  [itemSprites.documents, "Beranda"],
  [itemSprites.food, "Modul Belajar"],
  [itemSprites.documents, "Peta Risiko"],
  [itemSprites.radio, "Jalur Evakuasi"],
  [itemSprites.food, "Tas Siaga 72 Jam"],
  [itemSprites.medicine, "Simulasi Gempa"],
  [badgeSprites.survivalReady, "Pencapaian"],
  [badgeSprites.awareCitizen, "Leaderboard"],
  [npcSprites.citizen, "Profil"],
  [itemSprites.flashlight, "Pengaturan"],
];

const steps = [
  {
    id: "drop",
    icon: itemSprites.medicine,
    title: "Tiarap",
    description: "Turun ke lantai dengan posisi tiarap untuk menghindari jatuh.",
    image: zoneImages.classroom,
  },
  {
    id: "cover",
    icon: itemSprites.food,
    title: "Berlindung",
    description: "Berlindung di bawah meja yang kokoh untuk melindungi kepala dan leher.",
    image: zoneImages.homeSafety,
  },
  {
    id: "hold",
    icon: itemSprites.radio,
    title: "Pegangan",
    description: "Pegang kaki meja dengan kuat agar meja tidak bergeser.",
    image: zoneImages.shakingRoom,
  },
];

const inventoryItems = [
  [itemSprites.water, "Air"],
  [itemSprites.medicine, "P3K"],
  [itemSprites.food, "Tas"],
  [itemSprites.radio, "Radio"],
  [itemSprites.documents, "Dokumen"],
  [itemSprites.flashlight, "Senter"],
];

const badges = [
  [badgeSprites.awareCitizen, "Aware Citizen"],
  [badgeSprites.preparedResident, "Prepared Resident"],
  [badgeSprites.survivalReady, "Survival Ready"],
  [badgeSprites.communityGuardian, "Community Guardian"],
  [badgeSprites.communityGuardian, "Disaster Champion"],
];

const leaderboard = [
  ["1.", npcSprites.professorQuake, "Satria", "12,450"],
  ["2.", npcSprites.citizen, "Aulia", "11,230"],
  ["3.", npcSprites.emergencyRanger, "Kirana", "9,870"],
  ["4.", npcSprites.rescueCommander, "Kamu", "7,560"],
];

const AssetImage = ({ src, alt = "", className = "", fit = "cover" }) => (
  <span className={`dashboard-image ${className}`}>
    <img src={src} alt={alt} loading="lazy" decoding="async" data-fit={fit} />
  </span>
);

const Meter = ({ value, tone = "green" }) => (
  <span className="dash-meter">
    <span className={`dash-meter__fill dash-meter__fill--${tone}`} style={{ width: `${value}%` }} />
  </span>
);

const PixelPreview = ({ module, progress }) => (
  <div className="pixel-preview pixel-preview--asset">
    <AssetImage src={module.image} alt={module.title} />
    <div className="pixel-preview__hud">
      <span>{module.title}</span>
      <strong>{progress}%</strong>
    </div>
  </div>
);

const Journey = () => {
  const [activeModuleId, setActiveModuleId] = useState("simulation");
  const [checkedSteps, setCheckedSteps] = useState([]);

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [activeModuleId],
  );

  const progress = Math.round((checkedSteps.length / steps.length) * 100);

  const toggleStep = (stepId) => {
    setCheckedSteps((current) => (
      current.includes(stepId)
        ? current.filter((item) => item !== stepId)
        : [...current, stepId]
    ));
  };

  return (
    <div className="rpg-dashboard">
      <header className="rpg-topbar">
        <a className="rpg-logo" href="#beranda" aria-label="EduQuake">
          <img src={uiAssets.logo} alt="" />
          <span>EduQuake</span>
        </a>
        <nav className="rpg-nav" aria-label="Navigasi utama">
          {["Beranda", "Modul Belajar", "Tentang Kami", "Profil"].map((item) => (
            <a key={item} className={item === "Modul Belajar" ? "is-active" : ""} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
              {item}
            </a>
          ))}
        </nav>
        <section className="player-hud" aria-label="Player HUD">
          <AssetImage src={npcSprites.rescueCommander} fit="contain" />
          <strong>LV. 13</strong>
          <Meter value={42} />
          <span>500 / 1000</span>
          <span className="hud-token">COIN 3,300</span>
          <span className="hud-token hud-token--gem">GEM 240</span>
          <button type="button" aria-label="Pengaturan">SET</button>
        </section>
      </header>

      <div className="rpg-shell">
        <aside className="rpg-sidebar" aria-label="Sidebar menu">
          <nav>
            {sidebarItems.map(([icon, label]) => (
              <button key={label} type="button" className={label === "Modul Belajar" ? "is-active" : ""}>
                <AssetImage src={icon} fit="contain" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <section className="sidebar-progress">
            <h3>Progres Simulasi</h3>
            <p>{checkedSteps.length} dari {steps.length} langkah</p>
            <Meter value={progress} tone="orange" />
            <span>{progress}%</span>
          </section>
        </aside>

        <main className="rpg-content" id="modul-belajar">
          <section className="dashboard-panel module-strip">
            <header className="panel-title">
              <AssetImage src={itemSprites.food} fit="contain" />
              <h1>Modul Belajar</h1>
            </header>
            <button className="strip-arrow" type="button" aria-label="Sebelumnya">PREV</button>
            <div className="module-card-row">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  className={`module-card ${module.id === activeModule.id ? "is-active" : ""}`}
                  onClick={() => setActiveModuleId(module.id)}
                >
                  <h2>{module.title}</h2>
                  <PixelPreview module={module} progress={module.id === activeModule.id ? progress : 0} />
                  <p>{module.description}</p>
                  <div className="card-progress">
                    <Meter value={module.id === activeModule.id ? progress : 0} tone="green" />
                    <span>{module.id === activeModule.id ? progress : 0}%</span>
                  </div>
                </button>
              ))}
            </div>
            <button className="strip-arrow strip-arrow--right" type="button" aria-label="Berikutnya">NEXT</button>
          </section>

          <section className="center-grid">
            <article className="dashboard-panel simulation-panel">
              <h2>Lanjutkan Simulasi</h2>
              <PixelPreview module={activeModule} progress={progress} />
              <h3>{activeModule.title}</h3>
              <p>{activeModule.description} Simulasi ini akan membantumu mempelajari langkah-langkah tepat saat terjadi gempa di dalam ruangan.</p>
              <div className="simulation-progress">
                <span>{checkedSteps.length} dari {steps.length} langkah dilakukan</span>
                <Meter value={progress} tone="green" />
                <strong>{progress}%</strong>
              </div>
              <button type="button">Lanjutkan</button>
            </article>

            <article className="dashboard-panel survival-panel">
              <h2>Langkah Bertahan Hidup</h2>
              <div className="step-list">
                {steps.map((step, index) => (
                  <label key={step.id} className={checkedSteps.includes(step.id) ? "is-done" : ""}>
                    <span className="step-number">{index + 1}</span>
                    <AssetImage src={step.icon} fit="contain" />
                    <span>
                      <strong>{step.title}</strong>
                      <small>{step.description}</small>
                    </span>
                    <input type="checkbox" checked={checkedSteps.includes(step.id)} onChange={() => toggleStep(step.id)} />
                  </label>
                ))}
              </div>
              <button type="button" onClick={() => setCheckedSteps([])}>Mulai Dari Awal</button>
            </article>
          </section>

          <section className="dashboard-panel leaderboard-panel">
            <h2>Leaderboard</h2>
            <div className="leaderboard-row">
              {leaderboard.map(([rank, avatar, name, score]) => (
                <div key={name} className={name === "Kamu" ? "is-player" : ""}>
                  <strong>{rank}</strong>
                  <AssetImage src={avatar} fit="contain" />
                  <span>{name}</span>
                  <b>{score}</b>
                </div>
              ))}
              <button type="button">Lihat Semua</button>
            </div>
          </section>
        </main>

        <aside className="rpg-right-panel" aria-label="Status dan inventory">
          <section className="dashboard-panel status-panel">
            <h2>Status</h2>
            <div className="status-line">
              <span className="status-icon status-icon--heart">HP</span>
              <strong>Nyawa</strong>
              <span className="heart-row">FULL FULL FULL LOW LOW LOW</span>
            </div>
            <div className="status-line">
              <span className="status-icon status-icon--stamina">ST</span>
              <strong>Stamina</strong>
              <Meter value={65} />
              <span>65%</span>
            </div>
            <div className="status-line">
              <span className="status-icon status-icon--xp">XP</span>
              <strong>Pengalaman</strong>
              <Meter value={50} tone="orange" />
              <span>500 / 1000</span>
            </div>
          </section>

          <section className="dashboard-panel items-panel">
            <h2>Items</h2>
            <div className="item-grid">
              {inventoryItems.map(([icon, label]) => (
                <div key={label}>
                  <AssetImage src={icon} fit="contain" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-panel badges-panel">
            <h2>Badges</h2>
            <div className="badge-grid">
              {badges.map(([icon, label]) => (
                <div key={label}>
                  <AssetImage src={icon} fit="contain" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <button type="button">Lihat Semua Badge</button>
          </section>
        </aside>
      </div>

      <footer className="rpg-footer">
        <div className="pixel-landscape" aria-hidden="true">
          <span className="mountain mountain--left" />
          <span className="mountain mountain--right" />
          <span className="monument" />
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className="building"
              style={{ left: `${18 + index * 3.8}%`, height: `${28 + (index % 5) * 6}px` }}
            />
          ))}
          {Array.from({ length: 22 }, (_, index) => (
            <span
              key={`tree-${index}`}
              className="tree"
              style={{ left: `${index < 11 ? 1 + index * 2.8 : 68 + (index - 11) * 2.8}%` }}
            />
          ))}
        </div>
        <p>Copyright 2024 EduQuake. Semua hak dilindungi.</p>
        <nav>
          <a href="#bantuan">Bantuan</a>
          <a href="#kontak">Kontak</a>
        </nav>
      </footer>

      <nav className="rpg-bottom-nav" aria-label="Navigasi mobile">
        {["Beranda", "Modul", "Inventory", "Badge", "Profil"].map((item) => (
          <a key={item} href="#modul-belajar">{item}</a>
        ))}
      </nav>
    </div>
  );
};

export default Journey;
