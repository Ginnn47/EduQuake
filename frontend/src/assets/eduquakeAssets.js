import commandCenter from "./zones/command-center/background/command-center.png";
import classroom from "./zones/earthquake-basics/background/pixel-classroom.png";
import riskMap from "./zones/risk-map/background/yogyakarta-risk-map.png";
import homeSafety from "./zones/home-mitigation/background/home-safety.png";
import inventoryRoom from "./zones/emergency-kit/background/inventory-room.png";
import shakingRoom from "./zones/simulation/background/shaking-room.png";
import evacuationRoute from "./zones/evacuation/background/evacuation-route.png";
import advancedHq from "./zones/final-challenge/background/advanced-hq.png";
import regionMap from "./maps/yogyakarta-region.png";
import bantulMap from "./zones/risk-map/props/bantul-map.png";
import slemanMap from "./zones/risk-map/props/sleman-map.png";
import gunungkidulMap from "./zones/risk-map/props/gunungkidul-map.png";
import logo from "./ui/hud/eduquake-logo.png";

import professorQuake from "./npc/professor-quake/sprite.svg";
import emergencyRanger from "./npc/emergency-ranger/sprite.svg";
import citizen from "./npc/citizen/sprite.svg";
import rescueCommander from "./npc/rescue-commander/sprite.svg";

import water from "./items/water/water.svg";
import food from "./items/food/food.svg";
import medicine from "./items/medicine/medicine.svg";
import flashlight from "./items/flashlight/flashlight.svg";
import radio from "./items/radio/radio.svg";
import documents from "./items/documents/documents.svg";

import awareCitizen from "./badges/aware-citizen/badge.svg";
import preparedResident from "./badges/prepared-resident/badge.svg";
import survivalReady from "./badges/survival-ready/badge.svg";
import communityGuardian from "./badges/community-guardian/badge.svg";

import activeRoute from "./routes/active/seismic-route.svg";
import completedRoute from "./routes/completed/seismic-route.svg";
import lockedRoute from "./routes/locked/seismic-route.svg";
import recommendedNode from "./routes/nodes/recommended-node.svg";
import currentNode from "./routes/nodes/current-node.svg";
import completedNode from "./routes/nodes/completed-node.svg";
import lockedNode from "./routes/nodes/locked-node.svg";

export const zoneImages = {
  commandCenter,
  classroom,
  riskMap,
  homeSafety,
  inventoryRoom,
  shakingRoom,
  evacuationRoute,
  advancedHq,
  regionMap,
};

export const mapImages = {
  bantulMap,
  slemanMap,
  gunungkidulMap,
};

export const uiAssets = {
  logo,
};

export const npcSprites = {
  professorQuake,
  emergencyRanger,
  citizen,
  rescueCommander,
};

export const itemSprites = {
  water,
  food,
  medicine,
  flashlight,
  radio,
  documents,
};

export const badgeSprites = {
  awareCitizen,
  preparedResident,
  survivalReady,
  communityGuardian,
};

export const routeSprites = {
  activeRoute,
  completedRoute,
  lockedRoute,
  recommendedNode,
  currentNode,
  completedNode,
  lockedNode,
};
