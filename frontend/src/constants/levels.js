import { badgeSprites } from "./eduquakeAssets";

export const preparednessLevels = [
  {
    id: "aware-citizen",
    title: "Aware Citizen",
    minXp: 0,
    badge: badgeSprites.awareCitizen,
    summary: "Mulai sadar risiko dan mengenali tindakan dasar.",
  },
  {
    id: "prepared-resident",
    title: "Prepared Resident",
    minXp: 260,
    badge: badgeSprites.preparedResident,
    summary: "Sudah punya rencana rumah dan perlengkapan inti.",
  },
  {
    id: "survival-ready",
    title: "Survival Ready",
    minXp: 560,
    badge: badgeSprites.survivalReady,
    summary: "Siap merespons skenario gempa dengan langkah benar.",
  },
  {
    id: "community-guardian",
    title: "Community Guardian",
    minXp: 900,
    badge: badgeSprites.communityGuardian,
    summary: "Mampu membantu keluarga dan komunitas setelah gempa.",
  },
];
