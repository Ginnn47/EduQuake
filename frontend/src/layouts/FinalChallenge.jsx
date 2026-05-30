import { useMemo, useState } from "react";
import { finalChallengeQuestions } from "../constants/finalChallenge";
import PixelButton from "./PixelButton";

const FinalChallenge = () => {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => (
    finalChallengeQuestions.reduce((total, question) => (
      answers[question.id] === question.answer ? total + 1 : total
    ), 0)
  ), [answers]);

  return (
    <div className="final-challenge">
      {finalChallengeQuestions.map((question) => (
        <article key={question.id}>
          <h3>{question.question}</h3>
          <div className="choice-grid">
            {question.choices.map((choice) => (
              <PixelButton
                key={choice}
                variant={answers[question.id] === choice ? "secondary" : "primary"}
                onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))}
              >
                {choice}
              </PixelButton>
            ))}
          </div>
          {answers[question.id] ? <p>{question.tip}</p> : null}
        </article>
      ))}
      <strong>Score {score}/{finalChallengeQuestions.length}</strong>
    </div>
  );
};

export default FinalChallenge;
