export const getReviewHint = (percent) => {
  if (percent >= 90) return "Siap menjadi penjaga komunitas.";
  if (percent >= 75) return "Lulus, tetapi ulangi zona yang masih terasa ragu.";
  return "Ulangi Basics, Kit, dan Evacuation sebelum mencoba lagi.";
};
