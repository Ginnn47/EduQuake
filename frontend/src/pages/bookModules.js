import Module01TutorialPage, { moduleMeta as tutorialModule } from "./Module01TutorialPage";
import Module02EarthquakePage, { moduleMeta as earthquakeModule } from "./Module02EarthquakePage";
import Module03DropCoverHoldPage, { moduleMeta as dropCoverHoldModule } from "./Module03DropCoverHoldPage";
import Module04EvacuationRoutePage, { moduleMeta as evacuationRouteModule } from "./Module04EvacuationRoutePage";
import Module05EmergencyCommunicationPage, { moduleMeta as emergencyCommunicationModule } from "./Module05EmergencyCommunicationPage";
import Module06HomeMitigationPage, { moduleMeta as homeMitigationModule } from "./Module06HomeMitigationPage";
import Module07EmergencyKitPage, { moduleMeta as emergencyKitModule } from "./Module07EmergencyKitPage";
import Module08EmergencyBagPage, { moduleMeta as emergencyBagModule } from "./Module08EmergencyBagPage";
import Module09FinalSimulationPage, { moduleMeta as finalSimulationModule } from "./Module09FinalSimulationPage";

export const modules = [
  { ...tutorialModule, Page: Module01TutorialPage },
  { ...earthquakeModule, Page: Module02EarthquakePage },
  { ...dropCoverHoldModule, Page: Module03DropCoverHoldPage },
  { ...evacuationRouteModule, Page: Module04EvacuationRoutePage },
  { ...emergencyCommunicationModule, Page: Module05EmergencyCommunicationPage },
  { ...homeMitigationModule, Page: Module06HomeMitigationPage },
  { ...emergencyKitModule, Page: Module07EmergencyKitPage },
  { ...emergencyBagModule, Page: Module08EmergencyBagPage },
  { ...finalSimulationModule, Page: Module09FinalSimulationPage },
];
