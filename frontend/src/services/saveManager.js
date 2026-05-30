import { readLocalSave, writeLocalSave } from "./localSave";

export const saveKey = "eduquake-rpg-save-v1";

export const loadSave = (fallback) => readLocalSave(saveKey, fallback);
export const persistSave = (save) => writeLocalSave(saveKey, save);
