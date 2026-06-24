import headUp from "../assets/ui/head_up.png";
import bookmarkModules from "../assets/ui/01-bkm1-clean.png";
import bookmarkInventory from "../assets/ui/01-bkm2-clean.png";
import bookmarkQuiz from "../assets/ui/01-bkm3-clean.png";
import tutorPoster from "../assets/ui/01-tutor-clean.png";
import guruModule from "../assets/npc/01-guru1-cutout.png";
import guruItem from "../assets/npc/01-guru2-cutout.png";
import { rewardItems } from "./bookRewards";

const tutorialSections = {
  modules: {
    title: "MODUL",
    points: [
      "Pelajari materi kesiapsiagaan gempa melalui 9 modul bertahap.",
      "Setiap modul berisi penjelasan interaktif dan contoh kasus.",
      "Selesaikan modul untuk mendapatkan reward item.",
    ],
  },
  inventory: {
    title: "ITEM",
    points: [
      "Item reward akan otomatis masuk ke inventory-mu.",
      "Kumpulkan item penting untuk mempersiapkan diri dengan lebih baik.",
      "Item di inventory akan digunakan saat tantangan akhir.",
    ],
  },
  quiz: {
    title: "QUIZ",
    points: [
      "Setiap modul memiliki mini quiz untuk menguji pemahamanmu.",
      "Jawab dengan benar untuk mendapatkan reward tambahan.",
      "Belajar sambil bermain, pengetahuanmu akan semakin kuat!",
    ],
  },
};

export const moduleMeta = {
  id: "tutorial",
  number: "01",
  navLabel: "Tutorial",
  title: "Module Tutorial",
  icon: rewardItems.paspor.icon,
  image: tutorPoster,
  posterStyle: {
    "--quest-poster-width": "min(100%, 400px)",
    "--quest-poster-offset-y": "-60px",
  },
  headerImage: headUp,
  subtitle: "Kenali sistem yang ada di Webpage EduQuake",
  pageTitle: "Get to Know about EduQuake's Adventure Book",
  description: "Kenali cara membaca buku petualangan ini, berpindah halaman, menjawab side quest, dan membuka final challenge.",
  leftPosterOnly: true,
  hideTip: true,
  quiz: {
    question: "Apa fungsi halaman modul di EduQuake?",
    answer: "Membuka materi, interaksi, dan reward kesiapsiagaan",
    options: ["Membuka materi, interaksi, dan reward kesiapsiagaan", "Hanya menampilkan gambar", "Mengganti navbar utama"],
  },
  rewards: [rewardItems.paspor, rewardItems.kartuIdentitas],
  tip: "Anggap buku ini seperti campaign RPG: setiap halaman memberi ilmu, misi kecil, dan item untuk akhir cerita.",
  gameplay: {
    type: "journal",
    label: "Interactive Journal",
    requiredActions: ["modules", "inventory", "quiz"],
    bookmarks: [
      {
        id: "modules",
        title: "Modul",
        asset: bookmarkModules,
        npc: guruModule,
        note: "Webpage ini terdiri dari 9 modul campaign. Setiap modul punya materi, interaksi gameplay, mini quiz, dan reward yang membantumu membuka tantangan akhir.",
        details: tutorialSections.modules.points,
      },
      {
        id: "inventory",
        title: "Inventory",
        asset: bookmarkInventory,
        npc: guruItem,
        note: "Setiap reward yang kamu dapat akan tersimpan sebagai bekal. Item dari modul sebelumnya dipakai untuk menyusun Tas Siaga 72 Jam.",
        details: tutorialSections.inventory.points,
      },
      {
        id: "quiz",
        title: "Quiz",
        asset: bookmarkQuiz,
        note: "Quiz adalah side quest kecil. Jawaban benar menambah progres modul dan membantu reward terbuka.",
        details: tutorialSections.quiz.points,
      },
    ],
    leftTitle: "Mentor Quake",
    leftText: "Buka tiga bookmark untuk memahami alur belajar EduQuake.",
  },
};

const Module01TutorialPage = ({ module, gameplay, activeDetail, completedActions, markAction, setActiveDetail, renderQuizBlock }) => {
  const activeBookmark = gameplay.bookmarks.find((bookmark) => bookmark.id === activeDetail) ?? gameplay.bookmarks[0];

  return (
    <section className="quest-gameplay quest-gameplay--journal quest-gameplay--tutorial">
      <p className="quest-module02-instruction">Klik masing masing bookmark untuk membuka materi.</p>
      <div className="quest-bookmark-drawer">
        {gameplay.bookmarks.map((bookmark) => (
          <button
            key={bookmark.id}
            type="button"
            className={[
              "quest-bookmark-drawer__item",
              activeBookmark.id === bookmark.id ? "is-active" : "",
              completedActions.includes(bookmark.id) ? "is-stamped" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => markAction(bookmark.id)}
          >
            <img src={bookmark.asset} alt="" />
            <span className="quest-bookmark-drawer__text">
              <strong>{bookmark.title}</strong>
            </span>
          </button>
        ))}
      </div>
      <article className={[
        "quest-open-note",
        "quest-tutorial-drawer-note",
        activeBookmark.id === "quiz" ? "quest-tutorial-drawer-note--quiz" : "",
      ].filter(Boolean).join(" ")}>
        <header className="quest-tutorial-note-header">
          <strong>{activeBookmark.title}</strong>
          <p>{activeBookmark.note}</p>
        </header>
        <ul className={activeBookmark.id === "quiz" ? "quest-tutorial-detail-list quest-tutorial-detail-list--quiz" : "quest-tutorial-detail-list"}>
          {(activeBookmark.details ?? []).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {activeBookmark.npc ? (
          <figure className="quest-tutorial-npc-frame">
            <img className="quest-tutorial-npc" src={activeBookmark.npc} alt="" />
          </figure>
        ) : null}
      </article>
      {activeBookmark.id === "quiz" ? renderQuizBlock() : null}
    </section>
  );
};

export default Module01TutorialPage;
