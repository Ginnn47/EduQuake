import airItem from "../assets/items/air-cutout.png";
import headSimulation from "../assets/ui/head_sim.png";
import actionBoard from "../assets/ui/03-act-clean.png";
import comicMain from "../assets/ui/03-comicmain-clean.png";
import actionSafe from "../assets/ui/03-green-clean.png";
import actionGlass from "../assets/ui/03-red-clean.png";
import actionRun from "../assets/ui/03-yellow-clean.png";
import armyGuide from "../assets/npc/army-fr-cutout.png";
import { rewardItems } from "./bookRewards";

export const moduleMeta = {
  id: "drop-cover-hold",
  number: "03",
  navLabel: "Action",
  title: "Emergency Action",
  icon: airItem,
  image: comicMain,
  // Atur besar/posisi poster modul ini dari sini.
  posterStyle: {
    "--quest-poster-width": "min(96%, 500px)",
    "--quest-poster-offset-y": "-2px",
  },
  headerImage: headSimulation,
  subtitle: "Kenali tindakan tepat saat keadaan darurat",
  pageTitle: "Right move leads to safety",
  description: "Latih refleks Drop, Cover, Hold agar tubuh langsung mencari perlindungan, bukan panik atau berlari tanpa arah.",
  bookLayout: "split-comic",
  leftPosterOnly: true,
  hideTip: true,
  quiz: {
    question: "Apa tindakan yang tepat apabila kamu di luar ruangan?",
    answer: "Cari area terbuka dan tetap tenang",
    options: ["Masuk ke bangunan yang bergoyang", "Cari area terbuka dan tetap tenang", "Menangis dan Panik"],
  },
  rewards: [rewardItems.air, rewardItems.makananInstan],
  tip: "Jauhi kaca, lemari tinggi, dan benda gantung. Keputusan beberapa detik pertama sangat menentukan.",
  gameplay: {
    type: "comic",
    label: "Scenario Comic",
    requiredActions: ["safe-action"],
    decisions: [
      {
        id: "safe-action",
        title: "Berlindung",
        detail: "Kamu masuk ke bawah meja, lindungi kepala, lalu pegang kaki meja.",
        panel: actionSafe,
        outcome: {
          eyebrow: "BERLINDUNG",
          status: "Tindakan Benar",
          icon: "OK",
          body: "Berlindung di bawah meja kokoh dapat melindungi kepala dan tubuh dari benda jatuh seperti kaca, lampu, atau plafon.",
          why: [
            "Mengurangi risiko cedera serius.",
            "Melindungi kepala dan leher.",
            "Pegang kaki meja agar perlindungan tetap stabil saat gempa berlangsung.",
          ],
        },
        correct: true,
      },
      {
        id: "run",
        title: "Lari",
        detail: "Risiko jatuh dan tertimpa benda lebih tinggi saat guncangan masih kuat.",
        panel: actionRun,
        outcome: {
          eyebrow: "LARI KELUAR",
          status: "Tindakan berisiko dan kurang aman",
          icon: "!",
          body: "Berlari saat gempa masih berlangsung dapat membuatmu terjatuh atau tertimpa benda runtuh.",
          why: [
            "Bisa terpeleset atau jatuh karena lantai penuh benda asing.",
            "Sulit menjaga keseimbangan saat tanah berguncang.",
          ],
        },
      },
      {
        id: "glass",
        title: "Dekat kaca",
        detail: "Pecahan kaca dapat melukai saat panel jendela retak.",
        panel: actionGlass,
        outcome: {
          eyebrow: "BERDIRI DI DEKAT JENDELA",
          status: "Tindakan Berbahaya",
          icon: "X",
          body: "Kaca jendela dapat pecah saat gempa dan melukai tubuh.",
          why: [
            "Rawan terkena pecahan kaca tajam dan cedera pada wajah atau tangan.",
            "Sangat berbahaya saat gempa kuat.",
            "Segera menjauh dari jendela, lemari tinggi, dan benda gantung.",
          ],
        },
      },
    ],
    actionBoard,
    leftTitle: "Reaction Window",
    leftText: "Dengarkan emergency story, baca tanda kelas, lalu pilih respons aman.",
  },
};

const Module03DropCoverHoldPage = ({ module, gameplay, activeDetail, completedActions, markAction, setActiveDetail, renderQuizBlock, placement = "default" }) => {
  const activeDecision = gameplay.decisions.find((decision) => decision.id === activeDetail);
  const selectedDecision = activeDecision ?? gameplay.decisions[0];
  const hasSelectedDecision = Boolean(activeDecision);

  if (placement === "left") {
    return (
      <section className="quest-gameplay quest-gameplay--comic quest-gameplay--module03 quest-gameplay--module03-left">
        <div className="quest-module03-comic-stack">
          <figure className="quest-module03-main-comic">
            <img src={comicMain} alt="" />
          </figure>
          <figure className="quest-module03-result-panel">
            {hasSelectedDecision ? (
              <img src={selectedDecision.panel} alt="" />
            ) : (
              <figcaption>Choose Right Act</figcaption>
            )}
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section className="quest-gameplay quest-gameplay--comic quest-gameplay--module03 quest-gameplay--module03-right">
      <div className="quest-module03-top-question">
      </div>
      <div className="quest-module03-action-board">
        <img src={gameplay.actionBoard} alt="" />
        {gameplay.decisions.map((decision) => (
          <button
            key={decision.id}
            type="button"
            className={[
              "quest-module03-action",
              `quest-module03-action--${decision.id}`,
              activeDecision?.id === decision.id ? "is-selected" : "",
              decision.correct && completedActions.includes("safe-action") ? "is-correct" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => (decision.correct ? markAction("safe-action", decision.id) : setActiveDetail(module.id, decision.id))}
            aria-label={decision.title}
          >
            <span>{decision.title}</span>
          </button>
        ))}
      </div>

      <article className={`quest-module03-outcome quest-module03-outcome--${selectedDecision.id}`}>
        <header>
          <span aria-hidden="true">{selectedDecision.outcome.icon}</span>
          <strong>{selectedDecision.outcome.eyebrow}</strong>
          <small>{selectedDecision.outcome.status}</small>
        </header>
        <p>{selectedDecision.outcome.body}</p>
        <div>
          <b><span aria-hidden="true">{selectedDecision.outcome.whyIcon}</span> WHY?</b>
          <ul>
            {selectedDecision.outcome.why.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {renderQuizBlock()}
        </div>
      </article>
    </section>
  );
};

export default Module03DropCoverHoldPage;
