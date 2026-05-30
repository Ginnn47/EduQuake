import { useMemo, useState } from "react";
import armyGuide from "../assets/npc/army-fr-cutout.png";
import AdventureBookHomePage from "./AdventureBookHomePage";
import { modules } from "./bookModules";
import { inventoryItems } from "./bookRewards";

const DashboardPage = () => {
  const [activeModuleId, setActiveModuleId] = useState("tutorial");
  const [completedActionsByModule, setCompletedActionsByModule] = useState({});
  const [activeDetailByModule, setActiveDetailByModule] = useState({});
  const [quizAnswersByModule, setQuizAnswersByModule] = useState({});
  const [quizIndexByModule, setQuizIndexByModule] = useState({});
  const [posterIndexByModule, setPosterIndexByModule] = useState({});
  const [bagItemKeys, setBagItemKeys] = useState([]);

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [activeModuleId],
  );

  const activeGameplay = activeModule.gameplay;
  const ActiveModulePage = activeModule.Page;

  const getRequiredActions = (module) => module.gameplay.requiredActions ?? [];
  const getQuizQuestions = (module) => {
    if (!module.quiz) {
      return [];
    }

    return module.quiz.questions ?? [module.quiz];
  };
  const getQuizAnswers = (module) => {
    const savedAnswers = quizAnswersByModule[module.id] ?? {};

    return typeof savedAnswers === "string" ? { 0: savedAnswers } : savedAnswers;
  };
  const getBackpackModule = () => modules.find((module) => module.id === "tas-siaga-72-jam");
  const getBagWeight = (keys = bagItemKeys) => {
    const backpack = getBackpackModule();

    return backpack.gameplay.slots
      .filter((slot) => keys.includes(slot.key))
      .reduce((total, slot) => total + slot.weight, 0);
  };

  const getModuleProgress = (module) => {
    const requiredActions = getRequiredActions(module);
    const completedActions = completedActionsByModule[module.id] ?? [];
    const completedCount =
      module.gameplay.type === "backpack"
        ? requiredActions.filter((actionId) => bagItemKeys.includes(actionId)).length
        : requiredActions.filter((actionId) => completedActions.includes(actionId)).length;
    const actionScore = requiredActions.length ? (completedCount / requiredActions.length) * 70 : 70;
    const quizAnswers = getQuizAnswers(module);
    const quizQuestions = getQuizQuestions(module);
    const quizScore = !quizQuestions.length || quizQuestions.every((question, index) => quizAnswers[index] === question.answer) ? 30 : 0;
    const overweightPenalty =
      module.gameplay.type === "backpack" && getBagWeight() > module.gameplay.weightLimit ? 35 : 0;

    return Math.max(0, Math.min(100, Math.round(actionScore + quizScore - overweightPenalty)));
  };

  const completedActions = completedActionsByModule[activeModule.id] ?? [];
  const activeDetail = activeDetailByModule[activeModule.id] ?? "";
  const quizQuestions = getQuizQuestions(activeModule);
  const currentQuizIndex = quizQuestions.length
    ? Math.min(quizIndexByModule[activeModule.id] ?? 0, quizQuestions.length - 1)
    : 0;
  const activePosters = activeGameplay.posters ?? [];
  const currentPosterIndex = Math.min(posterIndexByModule[activeModule.id] ?? 0, Math.max(0, activePosters.length - 1));
  const activePoster = activePosters[currentPosterIndex];
  const activeModuleImage = activePoster?.image ?? activeModule.image;
  const activePosterStyle = {
    ...(activeModule.posterStyle ?? {}),
    ...(activePoster?.style ?? {}),
  };
  const progress = getModuleProgress(activeModule);
  const currentModuleIndex = modules.findIndex((module) => module.id === activeModule.id);
  const nextModule = modules[currentModuleIndex + 1];
  const finalUnlocked = modules.slice(0, 8).every((module) => getModuleProgress(module) === 100);
  const isFinalLocked = activeModule.id === "simulasi-akhir" && !finalUnlocked;
  const displayProgress = isFinalLocked ? 0 : progress;
  const completedModuleIds = new Set(
    modules.filter((module) => getModuleProgress(module) === 100).map((module) => module.id),
  );
  const earnedInventoryKeys = new Set(
    modules.flatMap((module) =>
      completedModuleIds.has(module.id)
        ? module.rewards.filter((reward) => reward.inventory !== false).map((reward) => reward.key)
        : [],
    ),
  );
  const rewardUnlocked = !isFinalLocked && progress === 100 && activeModule.rewards.length > 0;
  const canAdvanceToNext = Boolean(nextModule) && progress === 100 && (nextModule.id !== "simulasi-akhir" || finalUnlocked);
  const nextButtonLabel = "Continue";
  const bagWeight = getBagWeight();
  const bagOverweight = activeGameplay.type === "backpack" && bagWeight > activeGameplay.weightLimit;
  const showBookFooter = Boolean(nextModule);
  const isSplitComicLayout = activeModule.bookLayout === "split-comic";
  const isFinalSimulationLayout = activeModule.bookLayout === "final-simulation";

  const setActiveDetail = (moduleId, detailId) => {
    setActiveDetailByModule((current) => ({
      ...current,
      [moduleId]: detailId,
    }));
  };

  const markAction = (actionId, detailId = actionId) => {
    if (isFinalLocked) {
      return;
    }

    setCompletedActionsByModule((current) => {
      const moduleActions = current[activeModule.id] ?? [];
      const nextActions = moduleActions.includes(actionId) ? moduleActions : [...moduleActions, actionId];

      return {
        ...current,
        [activeModule.id]: nextActions,
      };
    });
    setActiveDetail(activeModule.id, detailId);
  };

  const answerQuiz = (answer, questionIndex = currentQuizIndex) => {
    if (isFinalLocked) {
      return;
    }

    setQuizAnswersByModule((current) => ({
      ...current,
      [activeModule.id]: {
        ...(typeof current[activeModule.id] === "string" ? { 0: current[activeModule.id] } : current[activeModule.id]),
        [questionIndex]: answer,
      },
    }));
  };

  const setQuizQuestionIndex = (moduleId, index) => {
    setQuizIndexByModule((current) => ({
      ...current,
      [moduleId]: Math.max(0, Math.min(index, (getQuizQuestions(modules.find((module) => module.id === moduleId) ?? activeModule).length || 1) - 1)),
    }));
  };

  const setPosterIndex = (moduleId, index) => {
    setPosterIndexByModule((current) => ({
      ...current,
      [moduleId]: index,
    }));
  };

  const toggleBagItem = (slot) => {
    if (isFinalLocked || !earnedInventoryKeys.has(slot.key)) {
      return;
    }

    setBagItemKeys((current) =>
      current.includes(slot.key) ? current.filter((key) => key !== slot.key) : [...current, slot.key],
    );
    setActiveDetail(activeModule.id, slot.key);
  };

  const goToNextModule = () => {
    if (!canAdvanceToNext) {
      return;
    }

    setActiveModuleId(nextModule.id);
  };

  const renderQuizBlock = ({ showSubmit = false, questionIndex = currentQuizIndex } = {}) => {
    const quizQuestion = quizQuestions[questionIndex] ?? activeModule.quiz;
    if (!quizQuestion) {
      return null;
    }

    const quizAnswer = getQuizAnswers(activeModule)[questionIndex] ?? "";

    return (
    <>
      <section className={isFinalLocked ? "quest-game-quiz variant-pixel-card is-locked" : "quest-game-quiz variant-pixel-card"} aria-label="Module question">
        <span className="quest-game-quiz__title">Module Question</span>
        <strong className="quest-game-quiz__question">{quizQuestion.question}</strong>
        {isFinalLocked ? (
          <small className="quest-lock-note">Final terkunci: tuntaskan modul 01-08 dan lengkapi tas.</small>
        ) : null}
        <div className="quest-quiz-options">
          {quizQuestion.options.map((option, index) => (
            <button
              key={option}
              type="button"
              disabled={isFinalLocked}
              className={[
                "quest-quiz-choice",
                "quest-game-quiz__option",
                quizAnswer === option ? "is-selected" : "",
                quizAnswer === option && option === quizQuestion.answer ? "is-correct" : "",
                quizAnswer === option && option !== quizQuestion.answer ? "is-wrong" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => answerQuiz(option, questionIndex)}
            >
              <span>{String.fromCharCode(97 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </section>
      {showSubmit ? (
        <button className="quest-cta quest-quiz-submit" type="button" disabled={!canAdvanceToNext} onClick={goToNextModule}>
          <span aria-hidden="true">&gt;</span>
          {canAdvanceToNext ? `Continue to Module ${nextModule?.number ?? ""}` : "Tuntaskan Modul"}
        </button>
      ) : null}
    </>
    );
  };

  const renderLeftFeature = () => {
    const selectedText = activeDetail ? `Entry aktif: ${activeDetail.replaceAll("-", " ")}` : activeGameplay.leftText;

    return (
      <aside className={`quest-left-feature quest-left-feature--${activeGameplay.type || "default"}`}>
        <strong>{activeGameplay.leftTitle ?? activeGameplay.label}</strong>
        <small>{selectedText}</small>
      </aside>
    );
  };

  return (
    <AdventureBookHomePage
      playerHud={{
        moduleProgress: displayProgress,
        moduleProgressText: `${displayProgress} / 100 MODUL`,
      }}
      navigationProps={{
        modules,
        activeModule,
        completedModuleIds,
        finalUnlocked,
        setActiveModuleId,
        inventoryItems,
        earnedInventoryKeys,
      }}
    >
      <section className="quest-book" aria-label="Buku simulasi">
        <span className="quest-book__spine" aria-hidden="true" />
        <span className="quest-book__ribbon quest-book__ribbon--top" aria-hidden="true" />
        <span className="quest-book__ribbon quest-book__ribbon--bottom" aria-hidden="true" />

        <article
          className={[
            "quest-page quest-page--left",
            activeModule.leftPosterOnly && !isSplitComicLayout && !isFinalSimulationLayout ? "quest-page--poster" : "",
            isFinalSimulationLayout ? "quest-page--finale-left" : "",
          ].filter(Boolean).join(" ")}
        >
          {activeModule.hideModuleHeader ? null : (
            <header
              className="quest-module-header"
              style={{ "--quest-module-header-bg": `url(${activeModule.headerImage})` }}
            >
              <span className="quest-module-badge">{activeModule.number}</span>
              <span className="quest-module-heading">
                <h1>{activeModule.title}</h1>
                <small>{activeModule.subtitle}</small>
              </span>
            </header>
          )}

          {isSplitComicLayout || isFinalSimulationLayout ? (
            <ActiveModulePage
              module={activeModule}
              gameplay={activeGameplay}
              activeDetail={activeDetail}
              completedActions={completedActions}
              earnedInventoryKeys={earnedInventoryKeys}
              inventoryItems={inventoryItems}
              bagItemKeys={bagItemKeys}
              bagWeight={bagWeight}
              bagOverweight={bagOverweight}
              markAction={markAction}
              setActiveDetail={setActiveDetail}
              toggleBagItem={toggleBagItem}
              renderQuizBlock={renderQuizBlock}
              placement="left"
            />
          ) : (
            <>
              <figure className={activeModule.leftPosterOnly ? "quest-illustration quest-illustration--poster" : "quest-illustration"} style={activePosterStyle}>
                <img src={activeModuleImage} alt="" />
                {activePosters.length > 1 ? (
                  <div className="quest-poster-switch" aria-label="Ganti poster modul">
                    {activePosters.map((poster, index) => (
                      <button
                        key={poster.id}
                        type="button"
                        className={index === currentPosterIndex ? "is-active" : ""}
                        onClick={() => setPosterIndex(activeModule.id, index)}
                        aria-label={poster.label}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                ) : null}
              </figure>

              {activeModule.leftPosterOnly ? null : renderLeftFeature()}

              {activeModule.leftPosterOnly ? null : <p className="quest-copy">{activeModule.description}</p>}
            </>
          )}

        </article>

        <article className={isFinalSimulationLayout ? "quest-page quest-page--right quest-page--finale-right" : "quest-page quest-page--right"}>
          {activeModule.hidePageTitle ? null : (
            <header className="quest-page-title">
              <h2>{activeModule.pageTitle}</h2>
              {activeModule.pageSubtitle ? <small>{activeModule.pageSubtitle}</small> : null}
            </header>
          )}

          <ActiveModulePage
            module={activeModule}
            gameplay={activeGameplay}
            activeDetail={activeDetail}
            completedActions={completedActions}
            earnedInventoryKeys={earnedInventoryKeys}
            inventoryItems={inventoryItems}
            bagItemKeys={bagItemKeys}
            bagWeight={bagWeight}
            bagOverweight={bagOverweight}
            isFinalLocked={isFinalLocked}
            finalUnlocked={finalUnlocked}
            progress={progress}
            markAction={markAction}
            setActiveDetail={setActiveDetail}
            currentQuizIndex={currentQuizIndex}
            quizQuestions={quizQuestions}
            setQuizQuestionIndex={setQuizQuestionIndex}
            toggleBagItem={toggleBagItem}
            renderQuizBlock={renderQuizBlock}
            placement={isSplitComicLayout || isFinalSimulationLayout ? "right" : "default"}
          />

          {activeModule.hideTip ? null : (
            <aside className="quest-tip">
              <span className="quest-tip__icon" aria-hidden="true" />
              <span>
                <strong>Tips</strong>
                <small>{activeModule.tip}</small>
              </span>
              <img src={armyGuide} alt="" />
            </aside>
          )}
        </article>

        {showBookFooter ? (
          <footer className="quest-book-footer" aria-label="Navigasi modul">
            <button className="quest-cta quest-next" type="button" disabled={!canAdvanceToNext} onClick={goToNextModule}>
              <span aria-hidden="true">&gt;</span>
              {nextButtonLabel}
            </button>
          </footer>
        ) : null}

        {rewardUnlocked ? (
          <aside className="quest-reward-popup" role="status" aria-label="Reward item terbuka">
            <strong>Reward Unlocked</strong>
            <div className="quest-reward-popup__items">
              {activeModule.rewards.map((reward) => (
                <span key={reward.key}>
                  <img src={reward.icon} alt="" />
                  <small>{reward.label}</small>
                </span>
              ))}
            </div>
          </aside>
        ) : null}
      </section>
    </AdventureBookHomePage>
  );
};

export default DashboardPage;
