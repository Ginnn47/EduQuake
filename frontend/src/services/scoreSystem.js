export const getQuizPercent = (correct, total) => {
  return total ? Math.round((correct / total) * 100) : 0;
};
