import senterItem from "../assets/items/senter-cutout.png";
import infographicPoster from "../assets/ui/02-infografis-clean.png";
import infographicPosterClean from "../assets/ui/02-infografis2-clean.png";
import infographicPosterThree from "../assets/ui/02-infografis3-clean.png";
import headHotspot from "../assets/ui/head_hotspot.png";
import notesBoard from "../assets/ui/notes-clean.png";
import { rewardItems } from "./bookRewards";

export const moduleMeta = {
  id: "gempa",
  number: "02",
  navLabel: "Basics",
  title: "Earthquake Basics",
  icon: senterItem,
  image: infographicPosterClean,
  posterStyle: {
    "--quest-poster-width": "min(96%, 455px)",
    "--quest-poster-offset-y": "-12px",
  },
  headerImage: headHotspot,
  subtitle: "Kenali gempa, sesar, dan alasan wilayah bisa terdampak!",
  pageTitle: "Hot Takes on Earthquake",
  description: "Pelajari penyebab gempa, peran sesar, magnitudo, dan dampak lokal agar kamu membaca risiko dengan lebih siap.",
  quiz: {
    questions: [
      {
        question: "Apa itu sesar?",
        answer: "Retakan kerak bumi yang dapat bergerak",
        options: ["Retakan kerak bumi yang dapat bergerak", "Arah angin dari laut", "Nama alat pengukur hujan"],
      },
      {
        question: "Mengapa wilayah bisa terdampak gempa?",
        answer: "Karena dekat sumber gempa",
        options: ["Karena dekat sumber gempa", "Karena langit mendung", "Karena suhu udara turun"],
      },
      {
        question: "Apa yang perlu diamati setelah memahami peta risiko?",
        answer: "Area rawan, jalur aman, dan bangunan sekitar",
        options: ["Area rawan, jalur aman, dan bangunan sekitar", "Warna baju petugas", "Arah dekorasi ruangan"],
      },
      {
        question: "Bentuk mitigasi struktural untuk mengurangi dampak gempa adalah?",
        answer: "Membangun rumah dengan struktur tahan gempa",
        options: ["Membangun rumah dengan struktur tahan gempa", "Menyediakan tas siaga bencana", "Menghafal jalur evakuasi"],
      }
    ],
  },
  rewards: [rewardItems.senter, rewardItems.gunting],
  tip: "Kenali bahaya sebelum memilih tindakan. Informasi risiko membuat keputusanmu lebih cepat saat guncangan datang.",
  leftPosterOnly: true,
  hideTip: true,
  gameplay: {
    type: "seismic",
    label: "Seismic Encyclopedia",
    requiredActions: ["episentrum", "sesar-opak", "tanah-lunak", "wilayah-rawan"],
    posters: [
      {
        id: "poster-encyclopedia",
        label: "Poster ensiklopedia gempa",
        image: infographicPosterClean,
        style: {
          "--quest-poster-width": "min(96%, 540px)",
          "--quest-poster-offset-y": "-60px",
        },
      },
      {
        id: "poster-analysis",
        label: "Poster analisis rawan gempa",
        image: infographicPoster,
        style: {
          "--quest-poster-width": "min(91%, 540px)",
          "--quest-poster-offset-y": "-70px",
        },
      },
      {
        id: "poster-yogyakarta-risk",
        label: "Poster bahaya gempa Yogyakarta",
        image: infographicPosterThree,
        style: {
          "--quest-poster-width": "min(92%, 540px)",
          "--quest-poster-offset-y": "-70px",
        },
      },
    ],
    notes: [
      {
        id: "episentrum",
        title: "Apa itu episentrum?",
        detail: "Episentrum adalah titik di permukaan bumi yang berada tepat di atas fokus gempa. Biasanya area dekat episentrum merasakan getaran lebih kuat.",
        buttonClass: "quest-module02-note-button--top-left",
        paperClass: "quest-module02-note-paper--top-left",
      },
      {
        id: "sesar-opak",
        title: "Apa itu Sesar Opak?",
        detail: "Sesar Opak adalah patahan aktif di wilayah Yogyakarta. Pergerakan pada sesar dapat melepas energi dan memicu guncangan.",
        buttonClass: "quest-module02-note-button--top-right",
        paperClass: "quest-module02-note-paper--top-right",
      },
      {
        id: "tanah-lunak",
        title: "Mengapa tanah lunak berbahaya?",
        detail: "Tanah lunak dapat memperkuat getaran. Bangunan di atas tanah seperti ini perlu perencanaan dan mitigasi yang lebih hati-hati.",
        buttonClass: "quest-module02-note-button--bottom-left",
        paperClass: "quest-module02-note-paper--bottom-left",
      },
      {
        id: "wilayah-rawan",
        title: "Di mana wilayah paling rawan?",
        detail: "Wilayah dekat sumber gempa, tanah lunak, kepadatan bangunan tinggi, dan jalur sempit perlu dipetakan sebagai area prioritas kesiapsiagaan.",
        buttonClass: "quest-module02-note-button--bottom-right",
        paperClass: "quest-module02-note-paper--bottom-right",
      },
    ],
    leftTitle: "Magnifier",
    leftText: "Arahkan dan klik hotspot untuk membuka catatan risiko.",
  },
};

const Module02EarthquakePage = ({ module, gameplay, activeDetail, completedActions, markAction, currentQuizIndex, quizQuestions, setQuizQuestionIndex, renderQuizBlock, quizAnswers = {} }) => {
  
  const goToQuestion = (offset) => {
    const nextIndex = (currentQuizIndex + offset + quizQuestions.length) % quizQuestions.length;
    setQuizQuestionIndex(module.id, nextIndex);
  };

  const isCurrentAnswered = quizAnswers[currentQuizIndex] !== undefined;

  return (
    <section className="quest-gameplay quest-gameplay--seismic quest-gameplay--module02">
      <p className="quest-module02-instruction">Klik catatan untuk membuka materi.</p>

      <div className="quest-module02-notes" style={{ "--module02-notes": `url(${notesBoard})` }} aria-label="Catatan penyelidik">
        
        {/* 1. Merender SEMUA area klik (tombol hotspot) */}
        {gameplay.notes.map((note) => (
          <button
            key={note.id}
            type="button"
            className={[
              "quest-module02-note-button",
              note.buttonClass,
              completedActions.includes(note.id) ? "is-open" : "",
              activeDetail === note.id ? "is-active" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => markAction(note.id)}
            aria-label={note.title}
          />
        ))}

        {/* 2. Merender SEMUA tulisan yang SUDAH diklik (disimpan di mading) */}
        {gameplay.notes.map((note) => {
          if (!completedActions.includes(note.id)) return null; // Sembunyikan kalau belum diklik
          return (
            <article key={`paper-${note.id}`} className={["quest-module02-note-paper", note.paperClass].join(" ")}>
              <strong>{note.title}</strong>
              <small>{note.detail}</small>
            </article>
          );
        })}
      </div>

      <article className="quest-module02-question-nav" aria-label="Navigasi pertanyaan modul">
        <button type="button" onClick={() => goToQuestion(-1)} aria-label="Pertanyaan sebelumnya">&lt;</button>
        <span>Pertanyaan {currentQuizIndex + 1} / {quizQuestions.length} {isCurrentAnswered ? "✓" : ""}</span>
        <button type="button" onClick={() => goToQuestion(1)} aria-label="Pertanyaan berikutnya">&gt;</button>
      </article>

      {renderQuizBlock({ questionIndex: currentQuizIndex })}
    </section>
  );
};

export default Module02EarthquakePage;