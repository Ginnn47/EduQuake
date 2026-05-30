import { npcSprites } from "./eduquakeAssets";

export const npcs = {
  professorQuake: {
    id: "professorQuake",
    name: "Professor Quake",
    role: "Main tutorial guide",
    sprite: npcSprites.professorQuake,
    line: "Kita ubah pengetahuan gempa menjadi kebiasaan yang bisa dipraktikkan.",
  },
  emergencyRanger: {
    id: "emergencyRanger",
    name: "Emergency Ranger",
    role: "Preparedness trainer",
    sprite: npcSprites.emergencyRanger,
    line: "Rute aman dan tas siaga tidak cukup dibaca, harus dilatih.",
  },
  citizen: {
    id: "citizen",
    name: "Local Citizen",
    role: "Storyteller",
    sprite: npcSprites.citizen,
    line: "Cerita lokal membantu kita membaca risiko dengan lebih dekat.",
  },
  rescueCommander: {
    id: "rescueCommander",
    name: "Rescue Commander",
    role: "Simulation instructor",
    sprite: npcSprites.rescueCommander,
    line: "Dalam simulasi, keputusan kecil bisa mengubah hasil besar.",
  },
};
