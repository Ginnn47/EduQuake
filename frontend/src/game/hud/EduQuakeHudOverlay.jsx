import { useEffect, useRef, useState } from "react";
import EduQuakeComicCard from "./EduQuakeComicCard";
import EduQuakeObjectivePanel from "./EduQuakeObjectivePanel";
import EduQuakePrompt from "./EduQuakePrompt";
import EduQuakeToast from "./EduQuakeToast";

const createToast = (detail) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  text: typeof detail === "string" ? detail : detail?.text,
  duration: typeof detail === "object" && detail?.duration ? detail.duration : 2600,
});

const EduQuakeHudOverlay = () => {
  const [activeObjective, setActiveObjective] = useState(null);
  const [objectiveMinimized, setObjectiveMinimized] = useState(false);
  const [activeComic, setActiveComic] = useState(null);
  const [comicMinimized, setComicMinimized] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [activePrompt, setActivePrompt] = useState(null);
  const [activeStatus, setActiveStatus] = useState("");
  const [toastQueue, setToastQueue] = useState([]);
  const toastTimersRef = useRef([]);

  useEffect(() => {
    const removeToast = (id) => {
      setToastQueue((current) => current.filter((toast) => toast.id !== id));
    };

    const handleObjective = (event) => setActiveObjective(event.detail || null);
    const handleComic = (event) => {
      setActiveComic(event.detail || null);
      setComicMinimized(false);
    };
    const handleComicClear = () => {
      setActiveComic(null);
      setComicMinimized(false);
    };
    const handlePrompt = (event) => {
      const detail = event.detail;
      const text = typeof detail === "string" ? detail : detail?.text;
      setActivePrompt(text ? { text } : null);
    };
    const handleStatus = (event) => {
      const detail = event.detail;
      const text = typeof detail === "string" ? detail : detail?.text;
      setActiveStatus(text || "");
    };
    const handleComplete = (event) => {
      setCompletion(event.detail || {});
      setObjectiveMinimized(false);
      setComicMinimized(false);
    };
    const handleToast = (event) => {
      const toast = createToast(event.detail);
      if (!toast.text) {
        return;
      }

      setToastQueue((current) => [...current, toast].slice(-3));
      const timerId = window.setTimeout(() => removeToast(toast.id), toast.duration);
      toastTimersRef.current.push(timerId);
    };

    window.addEventListener("eduquake:objective", handleObjective);
    window.addEventListener("eduquake:comic", handleComic);
    window.addEventListener("eduquake:comic:clear", handleComicClear);
    window.addEventListener("eduquake:prompt", handlePrompt);
    window.addEventListener("eduquake:status", handleStatus);
    window.addEventListener("eduquake:complete", handleComplete);
    window.addEventListener("eduquake:toast", handleToast);

    return () => {
      window.removeEventListener("eduquake:objective", handleObjective);
      window.removeEventListener("eduquake:comic", handleComic);
      window.removeEventListener("eduquake:comic:clear", handleComicClear);
      window.removeEventListener("eduquake:prompt", handlePrompt);
      window.removeEventListener("eduquake:status", handleStatus);
      window.removeEventListener("eduquake:complete", handleComplete);
      window.removeEventListener("eduquake:toast", handleToast);
      toastTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      toastTimersRef.current = [];
    };
  }, []);

  return (
    <div className="eduquake-hud-overlay" aria-label="Informasi simulasi EduQuake">
      {(activeObjective || activeStatus) && objectiveMinimized ? (
        <button
          className="eduquake-objective-restore"
          type="button"
          onClick={() => setObjectiveMinimized(false)}
          aria-label="Tampilkan task"
        >
          Task
        </button>
      ) : null}
      <EduQuakeObjectivePanel
        objective={objectiveMinimized ? null : activeObjective}
        status={objectiveMinimized ? "" : activeStatus}
        onMinimize={() => setObjectiveMinimized(true)}
      />
      {activeComic && comicMinimized ? (
        <button
          className="eduquake-comic-restore"
          type="button"
          onClick={() => setComicMinimized(false)}
          aria-label="Tampilkan komik"
        >
          Komik
        </button>
      ) : null}
      <EduQuakeComicCard comic={comicMinimized ? null : activeComic} onMinimize={() => setComicMinimized(true)} />
      <EduQuakePrompt prompt={activePrompt} />
      {completion ? (
        <section className="eduquake-completion-panel" aria-label="Simulasi selesai">
          <span>Simulasi Selesai</span>
          <strong>Berhasil Siaga Gempa</strong>
          <p>Skor akhir: {completion.score ?? "-"}</p>
          <button
            type="button"
            onClick={() => {
              window.location.assign(completion.returnPath || "/#modul-belajar");
            }}
          >
            Keluar
          </button>
        </section>
      ) : null}
      <EduQuakeToast toasts={toastQueue} />
    </div>
  );
};

export default EduQuakeHudOverlay;
