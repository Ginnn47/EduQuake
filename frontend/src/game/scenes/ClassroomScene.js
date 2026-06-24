import Phaser from "phaser";
import { ASSETS } from "../assetManifest";

const BUILD_LABEL = "BUILD: GLOBAL INPUT MOVEMENT V27";
const ENABLE_AUDIO = false;

const PLAYER_FRAME_SIZE = 256;
const PLAYER_SPEED = 170;
const PLAYER_VISUAL_SIZE = 144;

const WORLD = {
  width: 2300,
  height: 1360,
};

const ROOM = {
  x: 250,
  y: 70,
  width: 1800,
  height: 1040,
};

const ROOM_CENTER = {
  x: ROOM.x + ROOM.width / 2,
  y: ROOM.y + ROOM.height / 2,
};

const WALL_THICKNESS = 28;
const TOP_WALL_HEIGHT = 200;

const FLOOR = {
  x: ROOM.x + WALL_THICKNESS,
  y: ROOM.y + TOP_WALL_HEIGHT,
  width: ROOM.width - WALL_THICKNESS * 2,
  height: ROOM.height - TOP_WALL_HEIGHT - WALL_THICKNESS,
};

const DOOR_POSITION = {
  x: ROOM_CENTER.x,
  y: ROOM.y + ROOM.height - 34,
};

const CLASSROOM_LAYOUT = {
  playerSpawn: { x: ROOM.x + 420, y: ROOM.y + 610 },
  front: {
    chalkboard: { x: ROOM_CENTER.x, y: ROOM.y + 92, width: 430, height: 136 },
    teacherDesk: { x: ROOM_CENTER.x, y: ROOM.y + 220, width: 250, height: 116 },
    teacher: { x: ROOM_CENTER.x, y: ROOM.y + 292 },
    window: { x: ROOM.x + 150, y: ROOM.y + 92, width: 132, height: 100 },
    frameLeft: { x: ROOM.x + 430, y: ROOM.y + 108, width: 82, height: 54 },
    frameRight: { x: ROOM.x + ROOM.width - 430, y: ROOM.y + 108, width: 82, height: 54 },
    bookshelfLeft: { x: ROOM.x + 340, y: FLOOR.y + 70, width: 240, height: 252 },
    cupboardRight: { x: ROOM.x + ROOM.width - 340, y: FLOOR.y + 70, width: 240, height: 252 },
  },
  studentDesks: [
    { x: ROOM_CENTER.x - 470, y: FLOOR.y + 285 },
    { x: ROOM_CENTER.x, y: FLOOR.y + 285 },
    { x: ROOM_CENTER.x + 470, y: FLOOR.y + 285 },
    { x: ROOM_CENTER.x - 470, y: FLOOR.y + 535 },
    { x: ROOM_CENTER.x, y: FLOOR.y + 535 },
    { x: ROOM_CENTER.x + 470, y: FLOOR.y + 535 },
  ],
  decor: {
    leftPlant: { x: ROOM.x + 90, y: ROOM.y + 335 },
    posterBoard: { x: ROOM.x + 95, y: ROOM.y + 480 },
    fireExtinguisher: { x: ROOM.x + 86, y: ROOM.y + 610 },
    worldMap: { x: ROOM.x + 205, y: ROOM.y + ROOM.height - 115 },
    bigTrash: { x: ROOM.x + 72, y: ROOM.y + ROOM.height - 90 },
    rightPlant: { x: ROOM.x + ROOM.width - 105, y: ROOM.y + 360 },
    cabinet: { x: ROOM.x + ROOM.width - 122, y: ROOM.y + ROOM.height - 145 },
    smallFrameRight: { x: ROOM.x + ROOM.width - 130, y: ROOM.y + 260 },
    alarm: { x: ROOM_CENTER.x + 250, y: ROOM.y + ROOM.height - 112 },
    medic: { x: ROOM_CENTER.x - 330, y: ROOM.y + ROOM.height - 112 },
    topTrash: { x: ROOM.x + ROOM.width - 160, y: FLOOR.y + 102 },
  },
  npcs: [
    { key: "murid1", x: ROOM.x + 150, y: ROOM.y + 250, panic: true },
    { key: "murid2", x: ROOM_CENTER.x + 95, y: FLOOR.y + 350, frontPanic: true },
    { key: "murid3", x: ROOM_CENTER.x + 555, y: FLOOR.y + 350, frontPanic: true },
    { key: "murid4", x: ROOM.x + 270, y: ROOM.y + 640 },
    { key: "murid1", x: ROOM_CENTER.x - 170, y: ROOM.y + 640 },
    { key: "murid2", x: ROOM_CENTER.x - 20, y: ROOM.y + 640 },
    { key: "murid4", x: ROOM_CENTER.x + 150, y: ROOM.y + 640 },
    { key: "murid3", x: ROOM.x + ROOM.width - 265, y: ROOM.y + 640 },
  ],
  ui: {
    rightPanelW: 350,
    comicHeight: 270,
    missionHeight: 230,
    dialogHeight: 86,
  },
};

const PLAYER_SPAWN = CLASSROOM_LAYOUT.playerSpawn;
const TEACHER_POSITION = CLASSROOM_LAYOUT.front.teacher;
const PANIC_STUDENT_POSITION = CLASSROOM_LAYOUT.npcs[0];

const SCORE = {
  start: 100,
  hazardPenalty: 5,
  shelterBonus: 20,
  medicBonus: 15,
};
const EVACUATION_TARGET_COUNT = 5;

const UI_DEPTH = 1000;
const OBJECT_DEPTH = 20;
const PLAYER_DEPTH = 50;
const UI_COLORS = {
  bg: 0x070402,
  panel: 0x160c07,
  panelSoft: 0x241308,
  stroke: 0xc9892e,
  strokeBright: 0xf4c668,
  text: "#fff3c4",
  accent: "#f4c668",
};

const createMoveKeyState = () => ({
  left: false,
  right: false,
  up: false,
  down: false,
  actionQueued: false,
});

const STATES = {
  INTRO_TUTORIAL: "INTRO_TUTORIAL",
  BASICS_RECALL: "BASICS_RECALL",
  PREPARE_CHECK: "PREPARE_CHECK",
  MITIGATION_SCAN: "MITIGATION_SCAN",
  QUAKE_START: "QUAKE_START",
  ACTION_DCH: "ACTION_DCH",
  COMMUNICATION_CHECK: "COMMUNICATION_CHECK",
  MEDIC_CHECK: "MEDIC_CHECK",
  EVACUATION_ROUTE: "EVACUATION_ROUTE",
  FINAL_EXIT: "FINAL_EXIT",
  COMPLETE: "COMPLETE",
};

const ACT_STATES = {
  ACT1_LESSON: "ACT1_LESSON",
  ACT2_QUAKE_START: "ACT2_QUAKE_START",
  ACT3_CABINET_COLLAPSE: "ACT3_CABINET_COLLAPSE",
  ACT4_AFTERSHOCK_HIDE: "ACT4_AFTERSHOCK_HIDE",
  ACT5_INJURED_STUDENT: "ACT5_INJURED_STUDENT",
  ACT6_RESCUE_AND_MEDIC: "ACT6_RESCUE_AND_MEDIC",
  ACT7_FIRST_AID_CALL: "ACT7_FIRST_AID_CALL",
  ACT8_EVACUATE_FRIENDS: "ACT8_EVACUATE_FRIENDS",
  ACT9_COMPLETE: "ACT9_COMPLETE",
};

const ACT_CONTENT = {
  ACT1_LESSON: {
    actNumber: 1,
    comic: "comic1",
    title: "ACT 1: Pelajaran IPA",
    comicTitle: "Pelajaran IPA",
    comicDescription: "Hari ini kelas belajar tentang lempeng tektonik dan gempa bumi.",
    speaker: "Alam",
    dialog:
      "Aku sedang berada di kelas untuk pelajaran Ilmu Pengetahuan Alam tentang lempeng tektonik dan gempa. Aku harus maju ke depan dan memperhatikan penjelasan Bu Guru.",
    mission: "Maju ke depan kelas dan hadapi Bu Guru.",
    status: "Belajar: IPA - Gempa Bumi | Tahap: Pengenalan",
    triggerHint: "Bergerak ke depan kelas menuju Bu Guru.",
  },
  ACT2_QUAKE_START: {
    actNumber: 2,
    comic: "comic2",
    title: "ACT 2: Gempa Terjadi",
    comicTitle: "Gempa Terjadi!",
    comicDescription: "Tiba-tiba lantai mulai bergetar. Buku jatuh dan suasana kelas menjadi panik.",
    speaker: "Alam",
    dialog:
      "Wah, gempa bumi! Aku harus tetap tenang dan ingat apa yang sudah diajarkan. Jangan langsung berlari keluar saat guncangan masih terjadi.",
    mission: "Tetap tenang. Jauhi jendela, lemari, dan benda berat.",
    status: "Siaga Gempa | Tahap: Guncangan Awal",
    triggerHint: "Jangan menuju pintu dulu. Cari area aman.",
  },
  ACT3_CABINET_COLLAPSE: {
    actNumber: 3,
    comic: "comic3",
    title: "ACT 3: Lemari Runtuh",
    comicTitle: "Bahaya Benda Tinggi",
    comicDescription: "Lemari dan rak tinggi mulai bergoyang keras. Beberapa siswa panik dan berhamburan.",
    speaker: "Sistem",
    dialog: "Rak dan lemari tinggi mulai bergoyang. Menjauh dari benda berat yang bisa roboh!",
    mission: "Jauhi lemari dan cari area aman di tengah kelas.",
    status: "Bahaya: Lemari dan rak tidak stabil",
    triggerHint: "Menjauh dari lemari. Jangan berdiri di dekat rak tinggi.",
  },
  ACT4_AFTERSHOCK_HIDE: {
    actNumber: 4,
    comic: "comic4",
    title: "ACT 4: Gempa Susulan",
    comicTitle: "Drop, Cover, Hold On",
    comicDescription: "Gempa susulan terjadi. Siswa harus segera berlindung di bawah meja yang kokoh.",
    speaker: "Alam",
    dialog:
      "Gempa susulan bisa terjadi kapan saja. Aku harus mencari meja terdekat, berlindung di bawahnya, melindungi kepala, dan bertahan sampai guncangan reda.",
    mission: "Cari meja terdekat lalu tekan E / Space untuk berlindung.",
    status: "Gempa susulan aktif | Cari perlindungan",
    triggerHint: "Dekati meja lalu tekan E / Space.",
  },
  ACT5_INJURED_STUDENT: {
    actNumber: 5,
    comic: "comic5",
    title: "ACT 5: Teman Cedera",
    comicTitle: "Teman Terluka",
    comicDescription: "Setelah guncangan reda, seorang siswa berkerudung terlihat panik dan kakinya terkena reruntuhan.",
    speaker: "Alam",
    dialog:
      "Guncangan mulai reda, tapi ada temanku yang terluka karena reruntuhan. Aku harus tetap tenang dan memeriksa keadaannya.",
    mission: "Dekati teman berkerudung yang cedera dan tekan E untuk memeriksa.",
    status: "Guncangan reda | Ada teman cedera",
    triggerHint: "Dekati teman cedera lalu tekan E.",
  },
  ACT6_RESCUE_AND_MEDIC: {
    actNumber: 6,
    comic: "comic6",
    title: "ACT 6: Bawa ke Tempat Aman",
    comicTitle: "Jauhkan dari Reruntuhan",
    comicDescription: "Alam membantu teman yang cedera menjauh dari area berbahaya lalu mencari kotak P3K.",
    speaker: "Alam",
    dialog:
      "Aku harus membawa temanku menjauh dari reruntuhan dan lemari yang roboh. Setelah itu aku harus mengambil kotak P3K yang tersedia di kelas.",
    mission: "Bawa teman ke area aman, lalu ambil kotak P3K.",
    status: "Pertolongan awal | Pindahkan korban ke tempat aman",
    triggerHint: "Bantu teman ke safe zone, lalu ambil P3K.",
  },
  ACT7_FIRST_AID_CALL: {
    actNumber: 7,
    comic: "comic7",
    title: "ACT 7: P3K dan Nomor Darurat",
    comicTitle: "Pertolongan Pertama",
    comicDescription: "Luka ringan diobati menggunakan P3K. Setelah itu bantuan harus dihubungi melalui nomor yang tepat.",
    speaker: "Alam",
    dialog:
      "Aku sudah membawa P3K. Sekarang aku harus membantu mengobati luka ringan temanku dan menghubungi nomor darurat yang benar tanpa panik.",
    mission: "Obati luka teman, pergi ke alarm merah, lalu pilih nomor bantuan yang benar.",
    status: "P3K aktif | Hubungi bantuan",
    triggerHint: "Tekan E di dekat teman cedera, lalu tekan alarm merah.",
  },
  ACT8_EVACUATE_FRIENDS: {
    actNumber: 8,
    comic: "comic8",
    title: "ACT 8: Evakuasi Bersama",
    comicTitle: "Rute Evakuasi",
    comicDescription: "Guru memberi instruksi evakuasi. Alam harus mengajak teman-teman keluar dengan tertib.",
    speaker: "Sistem",
    dialog:
      "Instruksi evakuasi diterima. Semua siswa harus keluar dengan tertib melalui rute aman. Jangan berlari, jangan dorong-dorongan, dan hindari reruntuhan.",
    mission: "Hampiri 5 teman termasuk teman cedera, lalu arahkan mereka menuju pintu keluar.",
    status: "Evakuasi aktif | Kumpulkan teman",
    triggerHint: "Dekati setiap teman lalu tekan E.",
  },
  ACT9_COMPLETE: {
    actNumber: 9,
    comic: "comic9",
    title: "ACT 9: Simulasi Selesai",
    comicTitle: "Berhasil Siaga Gempa",
    comicDescription: "Alam berhasil menerapkan langkah siaga gempa: tenang, berlindung, menolong, dan evakuasi.",
    speaker: "Sistem",
    dialog:
      "Bagus! Kamu berhasil menerapkan langkah siaga gempa dengan benar. Kamu tetap tenang, berlindung, membantu teman, menghubungi bantuan, dan melakukan evakuasi.",
    mission: "Simulasi selesai.",
    status: "Complete | Siaga Gempa Level 1",
    triggerHint: "Mission complete.",
  },
};

const HAZARD_TEXTURE_KEYS = {
  chalkboard: "chalkboard_hazard",
  chair: "chair_hazard",
  teacherDesk: "teacher_desk_hazard",
  cabinet: "cabinet_hazard",
  cupboard: "cupboard_hazard",
  bookshelf: "bookshelf_hazard",
  window: "window_hazard",
  plant: "plant_hazard",
  trashBin: "trash_bin_hazard",
  bigTrash: "trash_bin_hazard",
};

const HAZARDABLE_OBJECTS = new Set(Object.keys(HAZARD_TEXTURE_KEYS));

const COMIC_TRIGGERS = {
  tutorialIntro: "Gunakan kontrol dan petunjuk misi untuk menyelesaikan simulasi.",
  basicsGempa: "Gempa adalah getaran permukaan bumi akibat pelepasan energi dari dalam bumi. Gempa tidak bisa dicegah sepenuhnya, tapi risikonya bisa dikurangi.",
  preparationKit: "Tas siaga berisi barang ringan dan penting: P3K, senter, peluit, air minum, dan dokumen penting.",
  windowHazard: "Jauhi jendela. Kaca bisa pecah saat gempa.",
  cabinetHazard: "Rak tinggi dan lemari bisa roboh. Jangan berlindung di dekatnya.",
  deskSafe: "Meja kokoh bisa menjadi tempat berlindung sementara.",
  quakeStart: "Gempa! Jangan lari. Tetap tenang dan cari perlindungan.",
  holdOn: "Bagus! Lindungi kepala dan tahan posisi sampai guncangan reda.",
  communicationTeacher: "Ikuti instruksi guru. Evakuasi dilakukan dengan tertib.",
  medicP3k: "Gunakan P3K untuk luka ringan dan laporkan ke guru.",
  evacuationRoute: "Ikuti tanda jalur evakuasi dan hindari benda jatuh.",
  endingComplete: "Kamu berhasil menerapkan semua langkah siaga gempa!",
};

const USE_REACT_INFORMATION_OVERLAY = true;

const dispatchEduQuakeHudEvent = (eventName, detail) => {
  if (!USE_REACT_INFORMATION_OVERLAY || typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const cleanHudText = (text = "") =>
  String(text)
    .replace(/^PROMPT\s*/i, "")
    .replace(/^\n+/, "")
    .trim();

const createObjectiveTasks = (mission = "", hint = "") => {
  const taskSource = [mission, hint].filter(Boolean).join(". ");

  return taskSource
    .split(/\.\s+|;\s+|,\s+lalu\s+|\s+lalu\s+/i)
    .map((task) => cleanHudText(task))
    .filter(Boolean)
    .slice(0, 5)
    .map((label) => ({ label, done: false }));
};

export default class ClassroomScene extends Phaser.Scene {
  constructor() {
    super("ClassroomScene");

    this.player = null;
    this.cursors = null;
    this.keys = null;
    this.lastDirection = "down";
    this.externalMoveKeys = createMoveKeyState();

    this.gameState = STATES.INTRO_TUTORIAL;
    this.actState = ACT_STATES.ACT1_LESSON;
    this.hasAct2Triggered = false;
    this.isQuakeActive = false;
    this.canTriggerTeacherZone = true;
    this.score = SCORE.start;
    this.currentMission = "Gunakan WASD / Arrow untuk bergerak. Dekati papan instruksi lalu tekan E.";
    this.currentStatus = "Normal";
    this.currentPrompt = "";
    this.currentSpeaker = ACT_CONTENT.ACT1_LESSON.speaker;
    this.lastHudDialogueSignature = "";
    this.lastHudObjectiveSignature = "";
    this.lastHudPrompt = "";
    this.lastHudStatus = "";
    this.lastHudToast = "";
    this.legacyInformationObjects = [];
    this.hazardCooldownUntil = 0;
    this.routeHazardCooldownUntil = 0;
    this.resultSubmitted = false;

    this.progress = null;
    this.interactionZones = {};
    this.comicOpen = false;
    this.comicCallback = null;
    this.comicCutInOpen = false;
    this.comicCutInCallback = null;
    this.isHolding = false;
    this.quakeStarted = false;
    this.flags = {};
    this.exitUnlocked = false;
    this.cabinetSafeStartTime = null;
    this.injuredStudent = null;
    this.injuredDebris = null;
    this.safeZone = null;
    this.firstAidKitZone = null;
    this.firstAidKitMarker = null;
    this.remainingFriends = [];
    this.rescuedCount = 0;
    this.quizOpen = false;
    this.quizFeedback = "";
    this.quizElements = [];
    this.quizFeedbackText = null;
    this.quizOptions = [];
    this.quizSelectedIndex = 0;
    this.dialogVisible = false;

    this.hazardZones = [];
    this.deskZones = [];
    this.exitZone = null;
    this.furnitureColliders = null;
    this.roomColliders = null;
    this.preQuakeDecor = [];
    this.postQuakeHazards = [];
    this.damageStateApplied = false;

    this.missionText = null;
    this.statusText = null;
    this.scoreText = null;
    this.controlText = null;
    this.hudPanel = null;
    this.hudTitleText = null;
    this.promptText = null;
    this.dialogPanel = null;
    this.dialogText = null;
    this.inputDebugText = null;
    this.buildText = null;
    this.resultPanel = null;
    this.safeMarker = null;
    this.safeZoneHighlight = null;
    this.exitMarker = null;
    this.warningIcons = [];
    this.npcs = [];
    this.teacherNpc = null;
    this.panicStudentNpc = null;
    this.panicFrontNpcs = [];
    this.timsarOfficer = null;
    this.timsarOfficerReady = false;
    this.teacherTriggerZone = null;
    this.classroomObjects = [];
    this.runtimeDecor = null;
    this.randomObjectZones = [];
    this.runRng = null;
    this.act2FurnitureHazardApplied = false;
    this.wallFrontLayer = null;
    this.floorLayer = null;
    this.dustOverlay = null;
    this.quakePulseTimer = null;
    this.uiGroup = null;
    this.sideComicPanel = null;
    this.sideComicImage = null;
    this.sideComicTitleText = null;
    this.sideComicActText = null;
    this.sideComicBodyText = null;
    this.sideComicFallbackText = null;
    this.cutInPanel = null;
    this.cutInImage = null;
    this.cutInTitleText = null;
    this.cutInBodyText = null;
  }

  preload() {
    this.load.spritesheet("player", ASSETS.sprites.player, {
      frameWidth: PLAYER_FRAME_SIZE,
      frameHeight: PLAYER_FRAME_SIZE,
    });

    ["guru", "murid1", "murid2", "murid3", "murid4"].forEach((key) => {
      if (ASSETS.sprites[key]) {
        this.load.spritesheet(key, ASSETS.sprites[key], {
          frameWidth: PLAYER_FRAME_SIZE,
          frameHeight: PLAYER_FRAME_SIZE,
        });
      }
    });

    Object.entries(ASSETS.objects).forEach(([key, path]) => {
      if (path.endsWith(".png")) {
        this.load.image(key, path);
      }
    });

    Object.entries(ASSETS.comics ?? {}).forEach(([key, path]) => {
      if (path.endsWith(".png")) {
        this.load.image(key, path);
      }
    });

    if (ASSETS.effects.sandstorm) {
      this.load.image("sandstorm", ASSETS.effects.sandstorm);
    }

    if (ASSETS.npcs?.timsar) {
      this.load.spritesheet("timsarOfficer", ASSETS.npcs.timsar, {
        frameWidth: PLAYER_FRAME_SIZE,
        frameHeight: PLAYER_FRAME_SIZE,
      });
    }

    if (ENABLE_AUDIO && ASSETS.audio.quake) {
      this.load.audio("quake", ASSETS.audio.quake);
    }
  }

  create() {
    console.log(BUILD_LABEL);
    console.log("Using cleaned player sprite:", ASSETS.sprites.player);

    this.resetRunState();
    this.physics.world.setBounds(FLOOR.x, FLOOR.y, FLOOR.width, FLOOR.height);

    this.createClassroom();
    this.createPlayer();
    this.createKeyboard();
    this.createPlayerAnimations();
    this.createUI();
    this.setupCamera();
    this.startAct1Lesson();
    this.focusCanvas();

    this.input.on("pointerdown", () => this.focusCanvas());
    this.scale.on("resize", this.layoutUI, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.quakePulseTimer?.remove(false);
      this.scale.off("resize", this.layoutUI, this);
    });
  }

  update(time, delta) {
    if (!this.player || !this.keys || !this.cursors) {
      return;
    }

    if (this.comicCutInOpen && this.consumeActionInput()) {
      this.hideComicCutIn();
    }

    if (this.comicOpen && this.consumeActionInput()) {
      this.closeComic();
    }

    if (this.quizOpen) {
      this.player.setVelocity(0, 0);
      this.updatePlayerAnimation(false, false, false, false);
      this.updateEmergencyQuizInput();
      return;
    }

    if (this.gameState === STATES.COMPLETE || this.isHolding) {
      this.player.setVelocity(0, 0);
      this.updatePlayerAnimation(false, false, false, false);
      return;
    }

    this.handlePlayerMovement();
    this.updateTimsarFollower();

    this.updateActFlow(time);
    this.updateDustOverlay();
  }

  resetRunState() {
    this.gameState = STATES.INTRO_TUTORIAL;
    this.actState = ACT_STATES.ACT1_LESSON;
    this.hasAct2Triggered = false;
    this.isQuakeActive = false;
    this.canTriggerTeacherZone = true;
    this.score = SCORE.start;
    this.currentMission = "Gunakan WASD / Arrow untuk bergerak. Dekati papan instruksi lalu tekan E.";
    this.currentStatus = "Normal";
    this.currentPrompt = "";
    this.hazardCooldownUntil = 0;
    this.routeHazardCooldownUntil = 0;
    this.resultSubmitted = false;
    this.progress = {
      tutorialDone: false,
      basicsDone: false,
      preparationDone: false,
      hasEmergencyKit: false,
      scanWindow: false,
      scanCabinet: false,
      scanDesk: false,
      mitigationDone: false,
      actionDone: false,
      communicationDone: false,
      medicDone: false,
      routeKnown: false,
    };
    this.interactionZones = {};
    this.comicOpen = false;
    this.comicCallback = null;
    this.comicCutInOpen = false;
    this.comicCutInCallback = null;
    this.isHolding = false;
    this.quakeStarted = false;
    this.flags = {
      act1ReachedTeacher: false,
      act2QuakeStarted: false,
      act3CabinetCollapsed: false,
      act4HiddenUnderDesk: false,
      act5InjuredStudentChecked: false,
      act6StudentMovedToSafeZone: false,
      act6HasFirstAidKit: false,
      act7FirstAidDone: false,
      act7EmergencyCallDone: false,
      act8AllFriendsGuided: false,
      act9Complete: false,
    };
    this.exitUnlocked = false;
    this.cabinetSafeStartTime = null;
    this.injuredStudent = null;
    this.injuredDebris = null;
    this.safeZone = null;
    this.firstAidKitZone = null;
    this.firstAidKitMarker = null;
    this.safeZoneHighlight?.setVisible(false);
    this.remainingFriends = [];
    this.rescuedCount = 0;
    this.quizOpen = false;
    this.quizFeedback = "";
    this.quizElements = [];
    this.quizFeedbackText = null;
    this.quizOptions = [];
    this.quizSelectedIndex = 0;
    this.dialogVisible = false;
    this.hazardZones = [];
    this.deskZones = [];
    this.exitZone = null;
    this.furnitureColliders = null;
    this.roomColliders = null;
    this.preQuakeDecor = [];
    this.postQuakeHazards = [];
    this.damageStateApplied = false;
    this.warningIcons = [];
    this.npcs = [];
    this.teacherNpc = null;
    this.panicStudentNpc = null;
    this.panicFrontNpcs = [];
    this.timsarOfficer = null;
    this.timsarOfficerReady = false;
    this.teacherTriggerZone = null;
    this.classroomObjects = [];
    this.runtimeDecor = null;
    this.randomObjectZones = [];
    this.runRng = new Phaser.Math.RandomDataGenerator([`${Date.now()}-${Math.random()}`]);
    this.act2FurnitureHazardApplied = false;
    this.wallFrontLayer = null;
    this.floorLayer = null;
    this.dustOverlay = null;
    this.quakePulseTimer = null;
    this.cutInPanel = null;
    this.cutInImage = null;
    this.cutInTitleText = null;
    this.cutInBodyText = null;
  }

  createClassroom() {
    this.createClassroomLayoutLikeReference();
  }

  createClassroomLayoutLikeReference() {
    this.furnitureColliders = this.physics.add.staticGroup();

    this.createRoomShell();
    this.createReferenceTargetFrontZone();
    this.createReferenceTargetDeskZone();
    this.createReferenceTargetDecorZone();
    this.createClassroomNpcs();
    this.createReferenceTargetExitZone();
    this.createPostQuakeDamageObjects();
  }

  createRoomShell() {
    this.add.rectangle(WORLD.width / 2, WORLD.height / 2, WORLD.width, WORLD.height, 0x0f0b08);

    this.add
      .rectangle(ROOM_CENTER.x + 12, ROOM_CENTER.y + 14, ROOM.width + 22, ROOM.height + 22, 0x050302, 0.45)
      .setDepth(0);
    this.add
      .rectangle(ROOM_CENTER.x, ROOM_CENTER.y, ROOM.width, ROOM.height, 0x3a1f12)
      .setDepth(1)
      .setStrokeStyle(4, 0x8b5a2b, 0.85);

    this.wallFrontLayer = this.add
      .tileSprite(ROOM_CENTER.x, ROOM.y + TOP_WALL_HEIGHT / 2, ROOM.width - 8, TOP_WALL_HEIGHT, "wallFront")
      .setDepth(2);
    this.add
      .rectangle(ROOM_CENTER.x, ROOM.y + TOP_WALL_HEIGHT / 2, ROOM.width - 8, TOP_WALL_HEIGHT, 0xd5a165, 0.14)
      .setDepth(3);

    this.floorLayer = this.add
      .tileSprite(FLOOR.x + FLOOR.width / 2, FLOOR.y + FLOOR.height / 2, FLOOR.width, FLOOR.height, "floorTile")
      .setDepth(2);

    const borderColor = 0x2b170d;
    const borderStroke = 0xc28a45;
    const bottomY = ROOM.y + ROOM.height - WALL_THICKNESS / 2;
    const bottomDoorGapWidth = 180;
    const bottomLeftWidth = Math.max(0, DOOR_POSITION.x - bottomDoorGapWidth / 2 - ROOM.x);
    const bottomRightX = DOOR_POSITION.x + bottomDoorGapWidth / 2;
    const bottomRightWidth = Math.max(0, ROOM.x + ROOM.width - bottomRightX);

    this.add.rectangle(ROOM_CENTER.x, ROOM.y + WALL_THICKNESS / 2, ROOM.width, WALL_THICKNESS, borderColor).setDepth(4);
    this.add.rectangle(ROOM.x + WALL_THICKNESS / 2, ROOM_CENTER.y, WALL_THICKNESS, ROOM.height, borderColor).setDepth(4);
    this.add.rectangle(ROOM.x + ROOM.width - WALL_THICKNESS / 2, ROOM_CENTER.y, WALL_THICKNESS, ROOM.height, borderColor).setDepth(4);
    this.add.rectangle(ROOM.x + bottomLeftWidth / 2, bottomY, bottomLeftWidth, WALL_THICKNESS, borderColor).setDepth(4);
    this.add.rectangle(bottomRightX + bottomRightWidth / 2, bottomY, bottomRightWidth, WALL_THICKNESS, borderColor).setDepth(4);

    this.add.rectangle(ROOM_CENTER.x, FLOOR.y - 3, FLOOR.width, 6, 0x6b3f1f).setDepth(5);
    this.add.rectangle(ROOM_CENTER.x, ROOM.y + 6, ROOM.width - 16, 3, borderStroke, 0.8).setDepth(5);
    this.add.rectangle(ROOM.x + 6, ROOM_CENTER.y, 3, ROOM.height - 16, borderStroke, 0.65).setDepth(5);
    this.add.rectangle(ROOM.x + ROOM.width - 6, ROOM_CENTER.y, 3, ROOM.height - 16, borderStroke, 0.65).setDepth(5);

    this.createRoomBoundaryColliders();
  }

  createReferenceTargetFrontZone() {
    const { chalkboard, teacherDesk, window, frameLeft, frameRight, bookshelfLeft, cupboardRight } = CLASSROOM_LAYOUT.front;

    this.addDecorObject(chalkboard.x, chalkboard.y, "chalkboard", chalkboard.width, chalkboard.height, OBJECT_DEPTH);
    this.addColliderObject(teacherDesk.x, teacherDesk.y, "teacherDesk", teacherDesk.width, teacherDesk.height, {
      bodyWidth: 150,
      bodyHeight: 44,
      bodyOffsetY: 22,
      depth: OBJECT_DEPTH + 2,
    });

    this.addDecorObject(window.x, window.y, "window", window.width, window.height, OBJECT_DEPTH);
    this.addDecorObject(frameLeft.x, frameLeft.y, "poster", frameLeft.width, frameLeft.height, OBJECT_DEPTH + 1);
    this.addDecorObject(frameRight.x, frameRight.y, "poster", frameRight.width, frameRight.height, OBJECT_DEPTH + 1);

    this.addColliderObject(bookshelfLeft.x, bookshelfLeft.y, "bookshelf", bookshelfLeft.width, bookshelfLeft.height, {
      bodyWidth: 154,
      bodyHeight: 136,
      bodyOffsetY: 18,
    });
    this.addColliderObject(cupboardRight.x, cupboardRight.y, "cupboard", cupboardRight.width, cupboardRight.height, {
      bodyWidth: 154,
      bodyHeight: 136,
      bodyOffsetY: 18,
    });

    this.addHazardZone(window.x, window.y, 122);
    this.addHazardZone(bookshelfLeft.x, bookshelfLeft.y, 128);
    this.addHazardZone(cupboardRight.x, cupboardRight.y, 128);
    this.interactionZones.instruction = { x: frameLeft.x, y: frameLeft.y, radius: 130 };
    this.interactionZones.basics = { x: chalkboard.x, y: chalkboard.y, radius: 180 };
    this.interactionZones.kit = { x: teacherDesk.x, y: teacherDesk.y, radius: 150 };
    this.interactionZones.communication = { x: teacherDesk.x, y: teacherDesk.y, radius: 155 };
    this.interactionZones.window = { x: window.x, y: window.y, radius: 125 };
  }

  createReferenceTargetDeskZone() {
    const desks = this.getStudentDeskPositions();

    desks.forEach(({ x, y }) => {
      this.createStudentDeskGroup(x, y);
      this.deskZones.push({
        x,
        y: y + 22,
        radius: 112,
      });
    });

    this.interactionZones.safeDesk = this.deskZones;
  }

  getStudentDeskPositions() {
    return CLASSROOM_LAYOUT.studentDesks;
  }

  createStudentDeskGroup(x, y) {
    this.addColliderObject(x, y, "desk", 132, 78, {
      bodyWidth: 96,
      bodyHeight: 34,
      bodyOffsetY: 12,
      depth: OBJECT_DEPTH + 2,
    });
    this.addDecorObject(x - 38, y + 70, "chair", 56, 58, OBJECT_DEPTH + 1);
    this.addDecorObject(x + 38, y + 70, "chair", 56, 58, OBJECT_DEPTH + 1);
  }

  getRunRng() {
    if (!this.runRng) {
      this.runRng = new Phaser.Math.RandomDataGenerator([`${Date.now()}-${Math.random()}`]);
    }

    return this.runRng;
  }

  getRandomFloorPoint(options = {}) {
    const rng = this.getRunRng();
    const marginX = options.marginX ?? 130;
    const marginTop = options.marginTop ?? 115;
    const marginBottom = options.marginBottom ?? 95;

    return {
      x: rng.between(FLOOR.x + marginX, FLOOR.x + FLOOR.width - marginX),
      y: rng.between(FLOOR.y + marginTop, FLOOR.y + FLOOR.height - marginBottom),
    };
  }

  isPointClear(point, radius, occupiedZones = []) {
    return occupiedZones.every((zone) => {
      const distance = Phaser.Math.Distance.Between(point.x, point.y, zone.x, zone.y);
      return distance >= radius + (zone.radius || 0);
    });
  }

  createStaticRandomAvoidZones() {
    const decor = CLASSROOM_LAYOUT.decor;
    const front = CLASSROOM_LAYOUT.front;
    return [
      ...CLASSROOM_LAYOUT.studentDesks.map(({ x, y }) => ({ x, y: y + 30, radius: 132 })),
      { x: front.bookshelfLeft.x, y: front.bookshelfLeft.y, radius: 150 },
      { x: front.cupboardRight.x, y: front.cupboardRight.y, radius: 150 },
      { x: front.teacherDesk.x, y: front.teacherDesk.y, radius: 142 },
      { x: front.teacher.x, y: front.teacher.y, radius: 95 },
      { x: PLAYER_SPAWN.x, y: PLAYER_SPAWN.y, radius: 115 },
      { x: DOOR_POSITION.x, y: DOOR_POSITION.y, radius: 140 },
      { x: ROOM_CENTER.x, y: FLOOR.y + FLOOR.height * 0.52, radius: 150 },
      { x: decor.leftPlant.x, y: decor.leftPlant.y, radius: 88 },
      { x: decor.rightPlant.x, y: decor.rightPlant.y, radius: 88 },
      { x: decor.fireExtinguisher.x, y: decor.fireExtinguisher.y, radius: 72 },
      { x: decor.worldMap.x, y: decor.worldMap.y, radius: 125 },
      { x: decor.alarm.x, y: decor.alarm.y, radius: 82 },
      { x: decor.cabinet.x, y: decor.cabinet.y, radius: 150 },
    ];
  }

  getRandomEmptyFloorPoint(options = {}) {
    const radius = options.radius ?? 72;
    const occupiedZones = options.occupiedZones ?? this.randomObjectZones ?? [];
    const maxAttempts = options.maxAttempts ?? 80;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const point = this.getRandomFloorPoint(options);
      if (this.isPointClear(point, radius, occupiedZones)) {
        return point;
      }
    }

    return this.getRandomFloorPoint(options);
  }

  createRuntimeDecorPositions() {
    const decor = Object.fromEntries(
      Object.entries(CLASSROOM_LAYOUT.decor).map(([key, value]) => [key, { ...value }])
    );
    const occupiedZones = this.createStaticRandomAvoidZones();

    decor.topTrash = this.getRandomEmptyFloorPoint({ marginX: 160, marginTop: 95, marginBottom: 130, radius: 72, occupiedZones });
    occupiedZones.push({ x: decor.topTrash.x, y: decor.topTrash.y, radius: 82 });
    decor.bigTrash = this.getRandomEmptyFloorPoint({ marginX: 150, marginTop: 155, marginBottom: 85, radius: 92, occupiedZones });
    occupiedZones.push({ x: decor.bigTrash.x, y: decor.bigTrash.y, radius: 104 });
    decor.posterBoard = this.getRandomEmptyFloorPoint({ marginX: 170, marginTop: 125, marginBottom: 125, radius: 112, occupiedZones });
    occupiedZones.push({ x: decor.posterBoard.x, y: decor.posterBoard.y, radius: 124 });
    decor.medic = this.getRandomEmptyFloorPoint({ marginX: 160, marginTop: 150, marginBottom: 95, radius: 82, occupiedZones });
    occupiedZones.push({ x: decor.medic.x, y: decor.medic.y, radius: 94 });

    this.runtimeDecor = decor;
    this.randomObjectZones = occupiedZones;
    return decor;
  }

  createReferenceTargetDecorZone() {
    const decor = this.runtimeDecor || this.createRuntimeDecorPositions();

    this.addDecorObject(decor.topTrash.x, decor.topTrash.y, "trashBin", 52, 60, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.smallFrameRight.x, decor.smallFrameRight.y, "poster", 68, 48, OBJECT_DEPTH + 1);
    this.addDecorObject(decor.leftPlant.x, decor.leftPlant.y, "plant", 90, 120, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.rightPlant.x, decor.rightPlant.y, "plant", 90, 120, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.posterBoard.x, decor.posterBoard.y, "mading", 150, 104, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.fireExtinguisher.x, decor.fireExtinguisher.y, "pemadam", 58, 74, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.bigTrash.x, decor.bigTrash.y, "bigTrash", 78, 92, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.worldMap.x, decor.worldMap.y, "map", 170, 112, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.medic.x, decor.medic.y, "medic", 74, 74, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.alarm.x, decor.alarm.y, "alarm", 60, 60, OBJECT_DEPTH + 2);
    this.addDecorObject(decor.cabinet.x, decor.cabinet.y, "cabinet", 196, 142, OBJECT_DEPTH + 2).setAngle(90);

    this.interactionZones.cabinet = [
      { x: CLASSROOM_LAYOUT.front.bookshelfLeft.x, y: CLASSROOM_LAYOUT.front.bookshelfLeft.y, radius: 150 },
      { x: CLASSROOM_LAYOUT.front.cupboardRight.x, y: CLASSROOM_LAYOUT.front.cupboardRight.y, radius: 150 },
    ];
    this.interactionZones.medic = { x: decor.medic.x, y: decor.medic.y, radius: 130 };
    this.interactionZones.routePoster = { x: decor.posterBoard.x, y: decor.posterBoard.y, radius: 130 };
    this.interactionZones.alarm = { x: decor.alarm.x, y: decor.alarm.y, radius: 130 };
  }

  createClassroomNpcs() {
    const studentPlacements = CLASSROOM_LAYOUT.npcs;

    const teacher = this.add
      .sprite(TEACHER_POSITION.x, TEACHER_POSITION.y, "guru", 0)
      .setDisplaySize(138, 138)
      .setDepth(PLAYER_DEPTH - 2);
    this.teacherNpc = teacher;
    this.npcs.push(teacher);

    this.teacherTriggerZone = this.add.zone(TEACHER_POSITION.x, TEACHER_POSITION.y + 56, 180, 130);
    this.physics.add.existing(this.teacherTriggerZone, true);

    studentPlacements.forEach(({ key, x, y, panic, frontPanic }, index) => {
      const idleFrame = [0, 4, 8, 12][index % 4];
      const npc = this.add
        .sprite(x, y, key, idleFrame)
        .setDisplaySize(118, 118)
        .setDepth(PLAYER_DEPTH - 4 + (index % 2));
      npc.hasEscaped = false;
      if (panic) {
        this.panicStudentNpc = npc;
      }
      if (frontPanic) {
        this.panicFrontNpcs.push(npc);
      }
      this.npcs.push(npc);
    });
  }

  createReferenceTargetExitZone() {
    const door = this.add.image(DOOR_POSITION.x, DOOR_POSITION.y, "door");
    door.setDisplaySize(110, 86).setAlpha(0.5).setDepth(OBJECT_DEPTH);
    this.exitZone = {
      x: door.x,
      y: door.y,
      radius: 115,
      door,
    };

    this.safeMarker = this.add.image(0, 0, "safeMarker");
    this.safeMarker.setDisplaySize(42, 42).setDepth(UI_DEPTH - 10).setVisible(false);

    this.exitMarker = this.add.image(this.exitZone.x, this.exitZone.y - 58, "exitMarker");
    this.exitMarker.setDisplaySize(54, 54).setDepth(UI_DEPTH - 10).setVisible(false);
  }

  createPostQuakeDamageObjects() {
    const debrisKeys = ["debris1", "debris2", "debris3", "debris4"];
    const rng = this.getRunRng();
    const debrisCount = 24;

    for (let index = 0; index < debrisCount; index += 1) {
      const width = rng.between(44, 86);
      const height = rng.between(30, 62);
      const radius = Math.max(width, height) * 0.58;
      const point = this.getRandomEmptyFloorPoint({
        marginX: 100,
        marginTop: 100,
        marginBottom: 80,
        radius,
        occupiedZones: this.randomObjectZones,
        maxAttempts: 55,
      });
      const debris = this.addPostQuakeHazard(point.x, point.y, debrisKeys[index % debrisKeys.length], width, height, OBJECT_DEPTH + 4, 0.92);
      debris.setAngle(rng.between(-18, 18));
      this.randomObjectZones.push({ x: point.x, y: point.y, radius: radius + 12 });
    }
  }

  addDecorObject(x, y, texture, width, height, depth = OBJECT_DEPTH) {
    const object = this.add.image(x, y, texture).setDisplaySize(width, height).setDepth(depth);
    this.preQuakeDecor.push(object);
    this.registerClassroomObject(object, texture);
    return object;
  }

  addColliderObject(x, y, texture, width, height, options = {}) {
    const object = this.physics.add.staticImage(x, y, texture).setDisplaySize(width, height).setDepth(options.depth ?? OBJECT_DEPTH + 2);
    object.body.setSize(options.bodyWidth ?? width * 0.72, options.bodyHeight ?? height * 0.42);
    object.body.setOffset(
      (object.width - object.body.width) / 2,
      (object.height - object.body.height) / 2 + (options.bodyOffsetY ?? 0)
    );
    object.refreshBody();
    this.furnitureColliders.add(object);
    this.preQuakeDecor.push(object);
    this.registerClassroomObject(object, texture);
    return object;
  }

  registerClassroomObject(sprite, type) {
    if (!HAZARDABLE_OBJECTS.has(type)) {
      return;
    }

    this.classroomObjects.push({
      name: `${type}_${this.classroomObjects.length + 1}`,
      type,
      sprite,
      normalKey: type,
      hazardKey: HAZARD_TEXTURE_KEYS[type],
      canBecomeHazard: true,
      warning: null,
    });
  }

  addPostQuakeHazard(x, y, texture, width, height, depth, alpha = 1) {
    const hazard = this.add.image(x, y, texture).setDisplaySize(width, height).setDepth(depth).setAlpha(alpha).setVisible(false);
    this.postQuakeHazards.push(hazard);
    return hazard;
  }

  createRoomBoundaryColliders() {
    this.roomColliders = this.physics.add.staticGroup();

    const colliders = [
      [ROOM_CENTER.x, FLOOR.y - WALL_THICKNESS / 2, FLOOR.width, WALL_THICKNESS],
      [FLOOR.x - WALL_THICKNESS / 2, FLOOR.y + FLOOR.height / 2, WALL_THICKNESS, FLOOR.height],
      [FLOOR.x + FLOOR.width + WALL_THICKNESS / 2, FLOOR.y + FLOOR.height / 2, WALL_THICKNESS, FLOOR.height],
      [ROOM_CENTER.x, FLOOR.y + FLOOR.height + WALL_THICKNESS / 2, FLOOR.width, WALL_THICKNESS],
    ];

    colliders.forEach(([x, y, width, height]) => {
      const boundary = this.add.rectangle(x, y, width, height, 0xff0000, 0);
      this.physics.add.existing(boundary, true);
      boundary.setVisible(false);
      this.roomColliders.add(boundary);
    });
  }

  createTiledArea(textureKey, x, y, width, height) {
    const source = this.textures.get(textureKey).getSourceImage();
    const tileWidth = Math.max(16, Math.min(96, source.width || 48));
    const tileHeight = Math.max(16, Math.min(96, source.height || 48));

    for (let tileY = y; tileY < y + height; tileY += tileHeight) {
      for (let tileX = x; tileX < x + width; tileX += tileWidth) {
        this.add
          .image(tileX + tileWidth / 2, tileY + tileHeight / 2, textureKey)
          .setDisplaySize(tileWidth, tileHeight)
          .setDepth(1);
      }
    }
  }

  addHazardZone(x, y, radius) {
    const warning = this.add.image(x, y - 88, "warningIcon");
    warning.setDisplaySize(44, 44).setDepth(UI_DEPTH - 5).setVisible(false);

    this.hazardZones.push({ x, y, radius, warning });
    this.warningIcons.push(warning);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(PLAYER_SPAWN.x, PLAYER_SPAWN.y, "player");
    this.player.setDisplaySize(PLAYER_VISUAL_SIZE, PLAYER_VISUAL_SIZE);
    this.player.setDepth(PLAYER_DEPTH);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(92, 116);
    this.player.body.setOffset((PLAYER_FRAME_SIZE - 92) / 2, PLAYER_FRAME_SIZE - 132);

    if (this.furnitureColliders) {
      this.physics.add.collider(this.player, this.furnitureColliders);
    }

    if (this.roomColliders) {
      this.physics.add.collider(this.player, this.roomColliders);
    }

    console.log("Player created", this.player);
  }

  createKeyboard() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.externalMoveKeys = createMoveKeyState();

    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      B: Phaser.Input.Keyboard.KeyCodes.B,
      C: Phaser.Input.Keyboard.KeyCodes.C,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.input.keyboard.enabled = true;

    console.log("Keyboard initialized", this.keys);
  }

  createPlayerAnimations() {
    this.createAnimation("player-walk-down", [0, 1, 2, 3]);
    this.createAnimation("player-walk-left", [4, 5, 6, 7]);
    this.createAnimation("player-walk-right", [8, 9, 10, 11]);
    this.createAnimation("player-walk-up", [12, 13, 14, 15]);
    this.createAnimation("timsar-walk-down", [0, 1, 2, 3], "timsarOfficer");
    this.createAnimation("timsar-walk-left", [4, 5, 6, 7], "timsarOfficer");
    this.createAnimation("timsar-walk-right", [8, 9, 10, 11], "timsarOfficer");
    this.createAnimation("timsar-walk-up", [12, 13, 14, 15], "timsarOfficer");
  }

  createAnimation(key, frames, textureKey = "player") {
    if (this.anims.exists(key)) {
      return;
    }

    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(textureKey, { frames }),
      frameRate: 8,
      repeat: -1,
    });
  }

  addToUIGroup(...objects) {
    if (!this.uiGroup) {
      return objects[0];
    }

    objects.filter(Boolean).forEach((object) => this.uiGroup.add(object));
    return objects[0];
  }

  createReadableText(x, y, text, options = {}) {
    const readableText = this.add
      .text(x, y, text, {
        fontFamily: '"Courier New", monospace',
        fontSize: options.fontSize || "14px",
        color: options.color || UI_COLORS.text,
        fontStyle: options.fontStyle,
        backgroundColor: options.backgroundColor,
        lineSpacing: options.lineSpacing ?? 5,
        padding: options.padding,
        align: options.align,
        wordWrap: { width: options.wrapWidth || 300 },
        resolution: 2,
      })
      .setScrollFactor(0)
      .setDepth(options.depth || UI_DEPTH + 200);

    if (options.origin) {
      readableText.setOrigin(options.origin.x, options.origin.y);
    }

    return this.addToUIGroup(readableText);
  }

  createUIPanel(x, y, w, h, title) {
    const bg = this.add
      .rectangle(x, y, w, h, UI_COLORS.panel, 0.92)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(UI_DEPTH);
    const borderOuter = this.add
      .rectangle(x, y, w, h, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 1)
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 1);
    const borderInner = this.add
      .rectangle(x + 5, y + 5, w - 10, h - 10, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x6b3b16, 1)
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 1);

    this.addToUIGroup(bg, borderOuter, borderInner);
    this.legacyInformationObjects.push(bg, borderOuter, borderInner);

    if (title) {
      const titleText = this.createReadableText(x + 16, y + 10, title, {
        fontSize: "13px",
        color: UI_COLORS.accent,
        wrapWidth: w - 32,
      });
      this.legacyInformationObjects.push(titleText);
    }

    return { bg, borderOuter, borderInner };
  }

  getFixedMapBounds() {
    const camera = this.cameras.main;
    const zoom = camera.zoom || 1;
    const worldView = camera.worldView;
    const rawX = (ROOM.x - worldView.x) * zoom;
    const rawY = (ROOM.y - worldView.y) * zoom;
    const rawW = ROOM.width * zoom;
    const rawH = ROOM.height * zoom;

    return {
      x: rawX,
      y: rawY,
      width: rawW,
      height: rawH,
    };
  }

  setUIPanelBounds(panel, x, y, w, h) {
    panel?.bg?.setPosition(x, y).setSize(w, h).setDisplaySize(w, h);
    panel?.borderOuter?.setPosition(x, y).setSize(w, h).setDisplaySize(w, h);
    panel?.borderInner?.setPosition(x + 5, y + 5).setSize(Math.max(0, w - 10), Math.max(0, h - 10)).setDisplaySize(Math.max(0, w - 10), Math.max(0, h - 10));
  }

  fitImageToBox(image, x, y, w, h) {
    if (!image?.texture) {
      return;
    }

    const source = image.texture.getSourceImage?.();
    const sourceW = source?.width || image.width || w;
    const sourceH = source?.height || image.height || h;
    const scale = Math.min(w / sourceW, h / sourceH);
    image.setPosition(x + w / 2, y + h / 2).setDisplaySize(sourceW * scale, sourceH * scale);
  }

  createUI() {
    if (this.uiGroup) {
      this.uiGroup.clear(true, true);
    }
    this.uiGroup = this.add.group();

    if (USE_REACT_INFORMATION_OVERLAY) {
      this.createDustOverlay();
      this.refreshScore();
      this.hideLegacyInformationUI();
      return;
    }

    const titleStyle = {
      fontFamily: "monospace",
      fontSize: "18px",
      color: UI_COLORS.accent,
      fontStyle: "bold",
    };

    const bodyStyle = {
      fontFamily: "monospace",
      fontSize: "14px",
      color: UI_COLORS.text,
      lineSpacing: 6,
      wordWrap: { width: 300 },
    };

    this.uiBackdrop = this.add
      .rectangle(0, 0, 100, 100, UI_COLORS.bg, 0.98)
      .setOrigin(0, 0)
      .setDepth(-1000)
      .setScrollFactor(0);

    this.brandPanel = this.add
      .rectangle(0, 0, 310, 56, UI_COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.strokeBright, 0.95)
      .setDepth(UI_DEPTH + 2)
      .setScrollFactor(0);
    this.brandTitleText = this.add
      .text(0, 0, "EDUQUAKE", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: UI_COLORS.accent,
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH + 3)
      .setScrollFactor(0);
    this.brandSubtitleText = this.add
      .text(0, 0, "Belajar Siaga, Selamat Bersama", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#ffd98a",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH + 3)
      .setScrollFactor(0);

    this.classroomFrameOuter = this.add
      .rectangle(0, 0, 100, 100, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(3, UI_COLORS.stroke, 0.9)
      .setDepth(UI_DEPTH - 2)
      .setScrollFactor(0);
    this.classroomFrameInner = this.add
      .rectangle(0, 0, 100, 100, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(1, UI_COLORS.strokeBright, 0.8)
      .setDepth(UI_DEPTH - 1)
      .setScrollFactor(0);

    this.hudPanel = this.add
      .rectangle(0, 0, 360, 330, UI_COLORS.panel, 0.94)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);

    this.hudTitleText = this.add.text(0, 0, "INFO EDUQUAKE", titleStyle).setDepth(UI_DEPTH + 1).setScrollFactor(0);
    this.missionText = this.add.text(0, 0, "", bodyStyle).setDepth(UI_DEPTH + 1).setScrollFactor(0);
    this.statusText = this.add.text(0, 0, "", bodyStyle).setDepth(UI_DEPTH + 1).setScrollFactor(0);
    this.scoreText = this.add.text(0, 0, "", bodyStyle).setDepth(UI_DEPTH + 1).setScrollFactor(0);
    this.controlText = this.add
      .text(0, 0, "KONTROL\nWASD / Arrow : Gerak\nE / Space    : Interaksi / Aksi\nESC          : Menu / Jeda", {
        ...bodyStyle,
        fontSize: "13px",
        color: "#f9eabf",
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);
    this.promptText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: UI_COLORS.accent,
        lineSpacing: 4,
        wordWrap: { width: 300 },
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    this.dialogPanel = this.add
      .rectangle(0, 0, 820, 120, UI_COLORS.panel, 0.96)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);

    this.dialogPortraitPanel = this.add
      .rectangle(0, 0, 160, 160, UI_COLORS.panelSoft, 0.96)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.dialogPortrait = this.add
      .sprite(0, 0, "player", 0)
      .setDisplaySize(130, 130)
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);
    this.dialogNameTag = this.add
      .text(0, 0, "ALAM", {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#1b0e08",
        backgroundColor: UI_COLORS.accent,
        fontStyle: "bold",
        padding: { x: 18, y: 4 },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(UI_DEPTH + 2)
      .setScrollFactor(0);
    this.dialogArrowText = this.add
      .text(0, 0, "v", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: UI_COLORS.accent,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(UI_DEPTH + 2)
      .setScrollFactor(0);

    this.dialogText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: UI_COLORS.text,
        lineSpacing: 7,
        wordWrap: { width: 760 },
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0)
      .setOrigin(0, 0.5);

    this.footerLeftPanel = this.add
      .rectangle(0, 0, 340, 52, UI_COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.footerLeftText = this.add
      .text(0, 0, "[09:15]     Senin, 20 Mei 2024", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: UI_COLORS.text,
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);
    this.inventoryButton = this.add
      .rectangle(0, 0, 210, 52, UI_COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.inventoryText = this.add
      .text(0, 0, "[TAB]  Inventori", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: UI_COLORS.text,
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);
    this.menuButton = this.add
      .rectangle(0, 0, 190, 52, UI_COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.menuText = this.add
      .text(0, 0, "[ESC]  Menu", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: UI_COLORS.text,
      })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);

    this.inputDebugText = this.add
      .text(16, 0, "INPUT: idle", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#ffff99",
        backgroundColor: "#000000",
        padding: { x: 6, y: 3 },
      })
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);

    this.buildText = this.add
      .text(16, 0, BUILD_LABEL, {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#baffba",
        backgroundColor: "#000000",
        padding: { x: 6, y: 3 },
      })
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);

    this.resultPanel = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#fff7c9",
        backgroundColor: "#130905",
        align: "center",
        padding: { x: 26, y: 18 },
        wordWrap: { width: 640 },
      })
      .setDepth(UI_DEPTH + 5)
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.addToUIGroup(
      this.uiBackdrop,
      this.brandPanel,
      this.brandTitleText,
      this.brandSubtitleText,
      this.classroomFrameOuter,
      this.classroomFrameInner,
      this.hudPanel,
      this.hudTitleText,
      this.missionText,
      this.statusText,
      this.scoreText,
      this.controlText,
      this.promptText,
      this.dialogPanel,
      this.dialogPortraitPanel,
      this.dialogPortrait,
      this.dialogNameTag,
      this.dialogArrowText,
      this.dialogText,
      this.footerLeftPanel,
      this.footerLeftText,
      this.inventoryButton,
      this.inventoryText,
      this.menuButton,
      this.menuText,
      this.inputDebugText,
      this.buildText,
      this.resultPanel
    );

    this.createSideComicUI();
    this.createComicCutInUI();
    this.rebuildFixedUI();
    this.createDustOverlay();
    this.refreshScore();
  }

  clearOldUI() {
    if (this.uiGroup) {
      this.uiGroup.getChildren().forEach((child) => child.destroy());
      this.uiGroup.clear(true, true);
    }

    this.uiGroup = this.add.group();
    this.legacyInformationObjects = [];
    this.sideComicPanel = null;
    this.sideComicImage = null;
    this.sideComicTitleText = null;
    this.sideComicActText = null;
    this.sideComicBodyText = null;
    this.sideComicFallbackText = null;
    this.hudPanel = null;
    this.hudTitleText = null;
    this.missionText = null;
    this.statusText = null;
    this.scoreText = null;
    this.controlText = null;
    this.promptText = null;
    this.dialogPanel = null;
    this.dialogPortraitPanel = null;
    this.dialogPortrait = null;
    this.dialogNameTag = null;
    this.dialogArrowText = null;
    this.dialogText = null;
    this.footerLeftPanel = null;
    this.footerLeftText = null;
    this.inventoryButton = null;
    this.inventoryText = null;
    this.menuButton = null;
    this.menuText = null;
    this.inputDebugText = null;
    this.buildText = null;
    this.cutInPanel = null;
    this.cutInImage = null;
    this.cutInTitleText = null;
    this.cutInBodyText = null;
  }

  createUIText(x, y, text, options = {}) {
    const uiText = this.add
      .text(x, y, text, {
        fontFamily: options.fontFamily || '"Courier New", monospace',
        fontSize: options.fontSize || "13px",
        color: options.color || UI_COLORS.text,
        fontStyle: options.fontStyle,
        lineSpacing: options.lineSpacing ?? 5,
        padding: options.padding,
        wordWrap: { width: options.wrapWidth || 300 },
        resolution: 2,
      })
      .setScrollFactor(0)
      .setDepth(options.depth || UI_DEPTH + 200);

    if (options.origin) {
      uiText.setOrigin(options.origin.x, options.origin.y);
    }

    this.uiGroup.add(uiText);
    return uiText;
  }

  rebuildFixedUI() {
    this.clearOldUI();

    const map = this.getFixedMapBounds();
    this.createComicPanelFromMap(map);
    this.createInfoPanelFromMap(map);
    this.createDialogPanelFromMap(map);
    this.createBottomButtonsFromMap(map);
    this.createDebugOverlay();

    this.resultPanel = this.createUIText(this.scale.width / 2, this.scale.height / 2, "", {
      fontSize: "22px",
      color: "#fff7c9",
      wrapWidth: 640,
      depth: UI_DEPTH + 700,
      origin: { x: 0.5, y: 0.5 },
      padding: { x: 26, y: 18 },
    }).setBackgroundColor("#130905").setVisible(false);

    this.refreshUIFromActState();
    this.hideLegacyInformationUI();
  }

  createDebugOverlay() {
    const y = Math.max(10, this.scale.height - 58);

    this.inputDebugText = this.createUIText(20, y, "INPUT: idle | GLOBAL: idle | X:0 Y:0", {
      fontSize: "13px",
      color: "#ffff99",
      wrapWidth: Math.min(820, this.scale.width - 40),
      depth: UI_DEPTH + 800,
      padding: { x: 8, y: 4 },
    }).setBackgroundColor("#000000");

    this.buildText = this.createUIText(20, y + 25, BUILD_LABEL, {
      fontSize: "11px",
      color: "#baffba",
      wrapWidth: Math.min(820, this.scale.width - 40),
      depth: UI_DEPTH + 800,
      padding: { x: 8, y: 4 },
    }).setBackgroundColor("#000000");
  }

  getSimulationUILayout(map) {
    const screenW = this.scale.width;
    const screenH = this.scale.height;
    const desktopLayout = screenW >= 1180;
    const margin = desktopLayout ? 28 : 16;
    const gap = desktopLayout ? 0 : 14;
    const rightW = desktopLayout
      ? Phaser.Math.Clamp(Math.round(screenW * 0.3), 500, 640)
      : screenW - margin * 2;
    const rightX = desktopLayout ? screenW - rightW - margin : margin;
    const comicY = margin;
    const comicH = desktopLayout
      ? Phaser.Math.Clamp(Math.round(screenH * 0.42), 350, 430)
      : Phaser.Math.Clamp(Math.round(screenH * 0.34), 220, 300);
    const infoY = comicY + comicH + gap;
    const infoH = Math.max(desktopLayout ? 330 : 220, screenH - infoY - margin);
    const dialogH = desktopLayout
      ? Phaser.Math.Clamp(Math.round(screenH * 0.22), 190, 235)
      : Phaser.Math.Clamp(Math.round(screenH * 0.2), 140, 180);
    const dialogY = screenH - dialogH - margin;
    const dialogW = desktopLayout ? Math.max(640, rightX - gap - margin) : screenW - margin * 2;

    return {
      comic: {
        x: rightX,
        y: comicY,
        w: rightW,
        h: comicH,
      },
      info: {
        x: rightX,
        y: infoY,
        w: rightW,
        h: infoH,
      },
      dialog: {
        x: margin,
        y: dialogY,
        w: dialogW,
        h: dialogH,
      },
      footer: {
        y: dialogY + dialogH + 14,  // Increased from 10
      },
    };
  }

  createComicPanelFromMap(map) {
    const { comic } = this.getSimulationUILayout(map);
    const comicX = comic.x;
    const comicY = comic.y;
    const comicW = comic.w;
    const comicH = comic.h;

    const panel = this.createUIPanel(comicX, comicY, comicW, comicH);

    this.sideComicPanel = panel.bg;
    this.sideComicTitleText = this.createUIText(comicX + 26, comicY + 22, "KOMIK EDUQUAKE", {
      fontSize: "26px",      // Increased from 22px
      color: UI_COLORS.accent,
      fontStyle: "bold",
      wrapWidth: comicW - 52,
    });
    this.sideComicActText = this.createUIText(comicX + 26, comicY + 64, "", {
      fontSize: "20px",      // Increased from 17px
      color: UI_COLORS.text,
      wrapWidth: comicW - 52,
      lineSpacing: 8,        // Added for better spacing
    });
    this.sideComicImage = this.add
      .image(comicX + comicW / 2, comicY + 250, "comic1")
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 100);
    this.uiGroup.add(this.sideComicImage);
    this.sideComicImageBox = {
      x: comicX + 26,
      y: comicY + 96,
      w: comicW - 52,
      h: Math.max(260, comicH - 220),
    };
    this.fitImageToBox(
      this.sideComicImage,
      this.sideComicImageBox.x,
      this.sideComicImageBox.y,
      this.sideComicImageBox.w,
      this.sideComicImageBox.h
    );
    this.sideComicFallbackText = this.createUIText(comicX + comicW / 2, comicY + comicH / 2, "", {
      fontSize: "21px",      // Increased from 18px
      color: UI_COLORS.text,
      wrapWidth: comicW - 70,
      origin: { x: 0.5, y: 0.5 },
    }).setVisible(false);
    this.sideComicBodyText = this.createUIText(comicX + 26, comicY + comicH - 104, "", {
      fontSize: "21px",      // Increased from 18px
      color: UI_COLORS.text,
      lineSpacing: 8,        // Increased from 7
      wrapWidth: comicW - 52,
    });
  }

  createInfoPanelFromMap(map) {
    const { info } = this.getSimulationUILayout(map);
    const infoX = info.x;
    const infoY = info.y;
    const infoW = info.w;
    const infoH = info.h;

    const panel = this.createUIPanel(infoX, infoY, infoW, infoH);

    this.hudPanel = panel.bg;
    this.hudTitleText = this.createUIText(infoX + 26, infoY + 24, "INFO EDUQUAKE", {
      fontSize: "26px",      // Increased from 22px
      color: UI_COLORS.accent,
      fontStyle: "bold",
      wrapWidth: infoW - 52,
    });
    this.missionText = this.createUIText(infoX + 26, infoY + 72, "", {
      fontSize: "20px",      // Increased from 18px
      lineSpacing: 8,        // Increased from 7
      wrapWidth: infoW - 52,
    });
    this.statusText = this.createUIText(infoX + 26, infoY + 156, "", {
      fontSize: "19px",      // Increased from 17px
      lineSpacing: 7,        // Increased from 6
      wrapWidth: infoW - 52,
    });
    this.scoreText = this.createUIText(infoX + 26, infoY + 224, "", {
      fontSize: "19px",      // Increased from 17px
      lineSpacing: 7,        // Increased from 6
      wrapWidth: infoW - 52,
    });
    this.controlText = this.createUIText(
      infoX + 26,
      infoY + 278,           // Adjusted Y position
      "KONTROL\nWASD / Arrow : Gerak\nE / Space    : Interaksi\nESC          : Pause / Menu",
      {
        fontSize: "18px",    // Increased from 16px
        wrapWidth: infoW - 52,
        lineSpacing: 7,      // Increased from 6
      }
    );
    this.promptText = this.createUIText(infoX + 26, infoY + Math.max(360, infoH - 52), "", {
      fontSize: "18px",      // Increased from 16px
      color: UI_COLORS.accent,
      wrapWidth: infoW - 52,
      lineSpacing: 7,        // Added
    });
  }

  createDialogPanelFromMap(map) {
    const { dialog } = this.getSimulationUILayout(map);
    const dialogY = dialog.y;
    const dialogH = dialog.h;
    const portraitX = dialog.x;
    const portraitY = dialogY;
    const portraitW = 200;      // Increased from 176 for better visibility
    const portraitH = dialogH;
    const dialogX = portraitX + portraitW + 20;  // Increased gap from 18
    const dialogW = dialog.w - portraitW - 20;

    this.dialogPortraitPanel = this.createUIPanel(portraitX, portraitY, portraitW, portraitH).bg;
    this.dialogPortrait = this.add
      .sprite(portraitX + portraitW / 2, portraitY + portraitH / 2 + 4, "player", 0)
      .setDisplaySize(170, 170)  // Increased from 154x154
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 120);
    this.uiGroup.add(this.dialogPortrait);

    this.dialogPanel = this.createUIPanel(dialogX, dialogY, dialogW, dialogH).bg;
    this.dialogNameTag = this.createUIText(dialogX + 24, dialogY - 24, "ALAM", {
      fontSize: "20px",      // Increased from 18px
      color: "#1b0e08",
      backgroundColor: UI_COLORS.accent,
      padding: { x: 24, y: 8 },  // Increased padding
      wrapWidth: 170,
      fontStyle: "bold",
    }).setBackgroundColor(UI_COLORS.accent);
    this.dialogArrowText = this.createUIText(dialogX + dialogW - 34, dialogY + dialogH - 30, "v", {
      fontSize: "32px",      // Increased from 28px
      color: UI_COLORS.accent,
      origin: { x: 0.5, y: 0.5 },
    });
    this.dialogText = this.createUIText(dialogX + 34, dialogY + 48, "", {
      fontSize: "24px",      // Increased from 22px
      lineSpacing: 12,       // Increased from 10
      wrapWidth: dialogW - 72,
    });
  }

  createBottomButtonsFromMap(map) {
    const { footer } = this.getSimulationUILayout(map);
    const y = footer.y;
    if (y + 34 > this.scale.height - 10) {
      return;
    }
    const timeW = 210;
    const invW = 156;
    const menuW = 130;

    this.footerLeftPanel = this.createUIPanel(map.x, y, timeW, 34).bg;
    this.footerLeftText = this.createUIText(map.x + 14, y + 9, "[09:15] Senin, 20 Mei 2024", {
      fontSize: "11px",
      wrapWidth: timeW - 28,
    });

    const menuX = map.x + map.width - menuW;
    const invX = menuX - invW - 14;
    this.inventoryButton = this.createUIPanel(invX, y, invW, 34).bg;
    this.inventoryText = this.createUIText(invX + 14, y + 9, "[TAB] Inventori", {
      fontSize: "11px",
      wrapWidth: invW - 28,
    });
    this.menuButton = this.createUIPanel(menuX, y, menuW, 34).bg;
    this.menuText = this.createUIText(menuX + 14, y + 9, "[ESC] Menu", {
      fontSize: "11px",
      wrapWidth: menuW - 28,
    });
  }

  refreshUIFromActState() {
    const content = ACT_CONTENT[this.actState] || ACT_CONTENT.ACT1_LESSON;
    const comicId = content.comic;

    this.sideComicTitleText?.setText("KOMIK EDUQUAKE");
    this.sideComicActText?.setText(content.title);
    this.sideComicBodyText?.setText(content.comicDescription);
    if (this.sideComicImage && this.textures.exists(comicId)) {
      this.sideComicImage.setTexture(comicId).setVisible(true);
      if (this.sideComicImageBox) {
        this.fitImageToBox(
          this.sideComicImage,
          this.sideComicImageBox.x,
          this.sideComicImageBox.y,
          this.sideComicImageBox.w,
          this.sideComicImageBox.h
        );
      }
      this.sideComicFallbackText?.setVisible(false);
    } else {
      this.sideComicImage?.setVisible(false);
      this.sideComicFallbackText?.setText(content.title).setVisible(true);
    }

    this.updateDialogSpeaker(content.speaker);
    if (this.dialogVisible !== false) {
      this.dialogText?.setText(this.dialogText?.text || content.dialog);
    }
    this.updateHUD();
  }

  createSideComicUI() {
    this.sideComicPanel = this.add
      .rectangle(0, 0, 320, 360, UI_COLORS.panel, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.stroke, 0.95)
      .setDepth(UI_DEPTH + 8)
      .setScrollFactor(0)
      .setVisible(false);

    this.sideComicImage = this.add
      .image(0, 0, "comic1")
      .setOrigin(0.5, 0.5)
      .setDepth(UI_DEPTH + 9)
      .setScrollFactor(0)
      .setVisible(false);

    this.sideComicTitleText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#1b0e08",
        backgroundColor: UI_COLORS.accent,
        fontStyle: "bold",
        padding: { x: 12, y: 3 },
      })
      .setDepth(UI_DEPTH + 10)
      .setScrollFactor(0)
      .setVisible(false);

    this.sideComicActText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: UI_COLORS.accent,
        lineSpacing: 3,
        wordWrap: { width: 280 },
        resolution: 2,
      })
      .setDepth(UI_DEPTH + 10)
      .setScrollFactor(0)
      .setVisible(false);

    this.sideComicBodyText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "15px",
        color: UI_COLORS.text,
        lineSpacing: 4,
        wordWrap: { width: 280 },
      })
      .setDepth(UI_DEPTH + 10)
      .setScrollFactor(0)
      .setVisible(false);

    this.sideComicFallbackText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#f9eabf",
        align: "center",
        wordWrap: { width: 260 },
      })
      .setDepth(UI_DEPTH + 10)
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.addToUIGroup(
      this.sideComicPanel,
      this.sideComicImage,
      this.sideComicTitleText,
      this.sideComicActText,
      this.sideComicBodyText,
      this.sideComicFallbackText
    );
  }

  createComicCutInUI() {
    this.cutInPanel = this.add
      .rectangle(0, 0, 720, 430, UI_COLORS.panel, 0.97)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(3, UI_COLORS.strokeBright, 1)
      .setDepth(UI_DEPTH + 1000)
      .setScrollFactor(0)
      .setVisible(false);
    this.cutInImage = this.add
      .image(0, 0, "comic1")
      .setOrigin(0.5, 0.5)
      .setDepth(UI_DEPTH + 1001)
      .setScrollFactor(0)
      .setVisible(false);
    this.cutInTitleText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: UI_COLORS.accent,
        fontStyle: "bold",
        wordWrap: { width: 660 },
        resolution: 2,
      })
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH + 1002)
      .setScrollFactor(0)
      .setVisible(false);
    this.cutInBodyText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: UI_COLORS.text,
        lineSpacing: 5,
        align: "center",
        wordWrap: { width: 660 },
        resolution: 2,
      })
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH + 1002)
      .setScrollFactor(0)
      .setVisible(false);

    this.addToUIGroup(this.cutInPanel, this.cutInImage, this.cutInTitleText, this.cutInBodyText);
  }

  createDustOverlay() {
    if (this.textures.exists("sandstorm")) {
      this.dustOverlay = this.add
        .tileSprite(ROOM_CENTER.x, ROOM_CENTER.y, ROOM.width, ROOM.height, "sandstorm")
        .setOrigin(0.5, 0.5)
        .setDepth(PLAYER_DEPTH + 35)
        .setTint(0xd6aa72)
        .setBlendMode(Phaser.BlendModes.MULTIPLY)
        .setAlpha(0);
      return;
    }

    this.dustOverlay = this.add
      .rectangle(ROOM_CENTER.x, ROOM_CENTER.y, ROOM.width, ROOM.height, 0xb3834c, 0)
      .setOrigin(0.5, 0.5)
      .setDepth(PLAYER_DEPTH + 35);
  }

  layoutUI() {
    if (USE_REACT_INFORMATION_OVERLAY) {
      this.hideLegacyInformationUI();
      return;
    }

    this.rebuildFixedUI();
  }

  setupCamera() {
    const camera = this.cameras.main;
    const desktopLayout = this.scale.width >= 1180;
    const margin = desktopLayout ? 16 : 16;
    const gap = desktopLayout ? 24 : 14;
    const rightPanelW = desktopLayout ? 0 : 0;
    const dialogH = desktopLayout ? 0 : 170;
    const mapAreaW = desktopLayout ? this.scale.width - rightPanelW - gap - margin * 2 : this.scale.width - margin * 2;
    const mapAreaH = desktopLayout ? this.scale.height - dialogH - gap - margin * 2 : this.scale.height - margin * 2;
    const desktopZoom = Math.min(1.08, mapAreaW / ROOM.width, mapAreaH / ROOM.height);
    const zoom = desktopLayout ? Phaser.Math.Clamp(desktopZoom, 0.72, 1.08) : 0.82;

    camera.setBounds(0, 0, WORLD.width, WORLD.height);
    camera.setZoom(zoom);
    if (desktopLayout) {
      camera.stopFollow();
      const targetCenterX = margin + mapAreaW / 2;
      const targetCenterY = margin + mapAreaH / 2;
      camera.setScroll(
        ROOM_CENTER.x - targetCenterX / zoom,
        ROOM_CENTER.y - targetCenterY / zoom
      );
    } else if (this.player) {
      camera.startFollow(this.player, true, 0.08, 0.08);
    } else {
      camera.centerOn(ROOM_CENTER.x, ROOM_CENTER.y);
    }
    this.layoutUI();
  }

  focusCanvas() {
    if (!this.game.canvas) {
      return;
    }

    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();
  }

  getGlobalInputState() {
    if (typeof window !== "undefined" && window.__EDUQUAKE_KEYS) {
      return window.__EDUQUAKE_KEYS;
    }

    return createMoveKeyState();
  }

  formatInputState(keys) {
    const activeKeys = [];

    if (keys.left) {
      activeKeys.push("L");
    }
    if (keys.right) {
      activeKeys.push("R");
    }
    if (keys.up) {
      activeKeys.push("U");
    }
    if (keys.down) {
      activeKeys.push("D");
    }
    if (keys.actionQueued) {
      activeKeys.push("ACT");
    }

    return activeKeys.length ? activeKeys.join("+") : "idle";
  }

  handlePlayerMovement() {
    const globalKeys = this.getGlobalInputState();
    const left = this.cursors.left.isDown || this.keys.A.isDown || globalKeys.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || globalKeys.right;
    const up = this.cursors.up.isDown || this.keys.W.isDown || globalKeys.up;
    const down = this.cursors.down.isDown || this.keys.S.isDown || globalKeys.down;

    let inputLabel = "idle";
    let moveX = 0;
    let moveY = 0;

    this.player.setVelocity(0, 0);

    if (left) {
      moveX -= 1;
      inputLabel = "left";
    } else if (right) {
      moveX += 1;
      inputLabel = "right";
    }

    if (up) {
      moveY -= 1;
      inputLabel = "up";
    } else if (down) {
      moveY += 1;
      inputLabel = "down";
    }

    this.player.setVelocity(moveX * PLAYER_SPEED, moveY * PLAYER_SPEED);

    if (this.player.body.velocity.length() > 0) {
      this.player.body.velocity.normalize().scale(PLAYER_SPEED);
    }

    this.updatePlayerAnimation(left, right, up, down);
    this.inputDebugText?.setText(
      `INPUT: ${inputLabel} | GLOBAL: ${this.formatInputState(globalKeys)} | X:${Math.round(this.player.x)} Y:${Math.round(this.player.y)}`
    );
  }

  updatePlayerAnimation(left, right, up, down) {
    if (left) {
      this.lastDirection = "left";
      this.player.setFlipX(false);
      this.player.anims.play("player-walk-left", true);
      return;
    }

    if (right) {
      this.lastDirection = "right";
      this.player.setFlipX(false);
      this.player.anims.play("player-walk-right", true);
      return;
    }

    if (up) {
      this.lastDirection = "up";
      this.player.setFlipX(false);
      this.player.anims.play("player-walk-up", true);
      return;
    }

    if (down) {
      this.lastDirection = "down";
      this.player.setFlipX(false);
      this.player.anims.play("player-walk-down", true);
      return;
    }

    this.player.anims.stop();
    const idleFrames = {
      down: 0,
      left: 4,
      right: 8,
      up: 12,
    };
    this.player.setFlipX(false);
    this.player.setFrame(idleFrames[this.lastDirection] ?? 0);
  }

  playDirectionAnimation(direction) {
    // Helper function untuk play animasi dengan konsistensi
    this.lastDirection = direction;
    this.player.setFlipX(false);
    
    const animationMap = {
      left: "player-walk-left",
      right: "player-walk-right",
      up: "player-walk-up",
      down: "player-walk-down",
    };

    if (animationMap[direction]) {
      this.player.anims.play(animationMap[direction], true);
    }
  }

  startAct1Lesson() {
    this.setActState(ACT_STATES.ACT1_LESSON);
    this.hasAct2Triggered = false;
    this.isQuakeActive = false;
    this.canTriggerTeacherZone = true;
    this.exitUnlocked = false;
    this.exitZone?.door?.setAlpha(0.5);
    this.exitMarker?.setVisible(false);
    this.setPrompt("");
  }

  getActiveActContent() {
    return ACT_CONTENT[this.actState] || ACT_CONTENT.ACT1_LESSON;
  }

  getPortraitForSpeaker(speaker) {
    const normalizedSpeaker = String(speaker || "").toLowerCase();
    if (normalizedSpeaker.includes("guru")) {
      return ASSETS.sprites.guru;
    }
    if (normalizedSpeaker.includes("sistem")) {
      return null;
    }

    return ASSETS.sprites.player;
  }

  emitHudEvent(eventName, detail) {
    dispatchEduQuakeHudEvent(eventName, detail);
  }

  createHudObjectivePayload() {
    const content = this.getActiveActContent();
    const tasks = createObjectiveTasks(this.currentMission || content.mission, content.triggerHint);

    return {
      title: content.comicTitle || content.title || "Objective",
      act: content.actNumber ? `Act ${content.actNumber}` : "Simulasi",
      tasks,
      progressText: `Bintang: ${this.score}`,
      status: this.currentStatus || content.status,
    };
  }

  emitObjectiveUpdate() {
    const objective = this.createHudObjectivePayload();
    const signature = `${this.actState}|${this.currentMission}|${this.currentStatus}|${this.score}`;
    if (signature === this.lastHudObjectiveSignature) {
      return;
    }

    this.lastHudObjectiveSignature = signature;
    this.emitHudEvent("eduquake:objective", objective);
  }

  emitStatusUpdate() {
    const status = this.currentStatus || "";
    if (status === this.lastHudStatus) {
      return;
    }

    this.lastHudStatus = status;
    this.emitHudEvent("eduquake:status", { text: status });
    if (/berhasil|hati-hati|tidak tepat|pintu|selesai/i.test(status) && status !== this.lastHudToast) {
      this.lastHudToast = status;
      this.emitHudEvent("eduquake:toast", { text: status });
    }
  }

  emitPromptUpdate() {
    const text = cleanHudText(this.currentPrompt);
    if (text === this.lastHudPrompt) {
      return;
    }

    this.lastHudPrompt = text;
    this.emitHudEvent("eduquake:prompt", { text });
  }

  emitDialogueUpdate(message, visible) {
    const text = cleanHudText(message);
    if (!visible || !text) {
      this.lastHudDialogueSignature = "";
      this.emitHudEvent("eduquake:dialogue:clear");
      return;
    }

    const speaker = String(this.currentSpeaker || this.getActiveActContent().speaker || "Sistem");
    const signature = `${speaker}|${text}`;
    if (signature === this.lastHudDialogueSignature) {
      return;
    }

    this.lastHudDialogueSignature = signature;
    this.emitHudEvent("eduquake:dialogue", {
      speaker,
      portrait: this.getPortraitForSpeaker(speaker),
      text,
      mode: speaker.toLowerCase() === "sistem" ? "system" : "character",
    });
  }

  emitComicUpdate(content) {
    if (!content) {
      return;
    }

    this.emitHudEvent("eduquake:comic", {
      title: content.comicTitle || "Komik EduQuake",
      subtitle: content.title,
      image: ASSETS.comics?.[content.comic],
      description: content.comicDescription,
      dismissible: true,
    });
  }

  hideLegacyInformationUI() {
    if (!USE_REACT_INFORMATION_OVERLAY) {
      return;
    }

    [
      this.uiBackdrop,
      this.brandPanel,
      this.brandTitleText,
      this.brandSubtitleText,
      this.classroomFrameOuter,
      this.classroomFrameInner,
      this.sideComicPanel,
      this.sideComicImage,
      this.sideComicTitleText,
      this.sideComicActText,
      this.sideComicBodyText,
      this.sideComicFallbackText,
      this.hudPanel,
      this.hudTitleText,
      this.missionText,
      this.statusText,
      this.scoreText,
      this.controlText,
      this.promptText,
      this.dialogPanel,
      this.dialogPortraitPanel,
      this.dialogPortrait,
      this.dialogNameTag,
      this.dialogArrowText,
      this.dialogText,
      this.cutInPanel,
      this.cutInImage,
      this.cutInTitleText,
      this.cutInBodyText,
      this.footerLeftPanel,
      this.footerLeftText,
      this.inventoryButton,
      this.inventoryText,
      this.menuButton,
      this.menuText,
      this.inputDebugText,
      this.buildText,
      this.resultPanel,
      ...(this.legacyInformationObjects || []),
    ].forEach((object) => {
      object?.setVisible?.(false);
      object?.setAlpha?.(0);
    });
  }

  setActState(nextState) {
    const content = ACT_CONTENT[nextState];
    if (!content) {
      return;
    }

    this.actState = nextState;
    this.showSideComic(content.comic);
    this.updateDialogSpeaker(content.speaker);
    this.updateDialogText(content.dialog);
    this.updateMissionText(content.mission);
    this.updateStatusText(content.status);
    this.showInteractionHint(content.triggerHint ? `PROMPT\n${content.triggerHint}` : "");
  }

  updateActFlow(time) {
    this.applyActHazardPenalties(time);

    if (this.isPlayerNearExit() && !this.exitUnlocked && this.actState !== ACT_STATES.ACT9_COMPLETE) {
      this.handlePrematureExitAttempt();
      return;
    }

    if (this.actState === ACT_STATES.ACT1_LESSON) {
      this.updateAct1Lesson();
      return;
    }

    if (this.actState === ACT_STATES.ACT3_CABINET_COLLAPSE) {
      this.updateAct3CabinetCollapse(time);
      return;
    }

    if (this.actState === ACT_STATES.ACT4_AFTERSHOCK_HIDE) {
      this.updateAct4AftershockHide();
      return;
    }

    if (this.actState === ACT_STATES.ACT5_INJURED_STUDENT) {
      this.updateAct5InjuredStudent();
      return;
    }

    if (this.actState === ACT_STATES.ACT6_RESCUE_AND_MEDIC) {
      this.updateAct6RescueAndMedic();
      return;
    }

    if (this.actState === ACT_STATES.ACT7_FIRST_AID_CALL) {
      this.updateAct7FirstAidCall();
      return;
    }

    if (this.actState === ACT_STATES.ACT8_EVACUATE_FRIENDS) {
      this.updateAct8EvacuateFriends();
    }
  }

  updateAct1Lesson() {
    if (!this.teacherTriggerZone || this.flags.act1ReachedTeacher) {
      return;
    }

    const overlapsTeacherZone = this.physics.overlap(this.player, this.teacherTriggerZone);
    this.showInteractionHint(overlapsTeacherZone ? "PROMPT\nHadap Bu Guru lalu tekan E / Space" : `PROMPT\n${ACT_CONTENT.ACT1_LESSON.triggerHint}`);

    if (overlapsTeacherZone && this.consumeActionInput()) {
      this.flags.act1ReachedTeacher = true;
      this.showComicCutIn("comic2", () => this.startAct2Quake());
    }
  }

  showSideComic(id) {
    const content = Object.values(ACT_CONTENT).find((item) => item.comic === id);
    if (!content) {
      return;
    }

    this.emitComicUpdate(content);

    if (USE_REACT_INFORMATION_OVERLAY || !this.sideComicPanel) {
      this.hideLegacyInformationUI();
      return;
    }

    this.sideComicPanel.setVisible(true);
    this.sideComicTitleText?.setText("KOMIK EDUQUAKE").setVisible(true);
    this.sideComicActText?.setText(content.title).setVisible(true);
    this.sideComicBodyText?.setText(content.comicDescription).setVisible(true);

    const hasTexture = this.textures.exists(id);
    this.sideComicImage?.setTexture(id).setVisible(hasTexture);
    if (hasTexture && this.sideComicImage && this.sideComicImageBox) {
      this.fitImageToBox(
        this.sideComicImage,
        this.sideComicImageBox.x,
        this.sideComicImageBox.y,
        this.sideComicImageBox.w,
        this.sideComicImageBox.h
      );
    }
    this.sideComicFallbackText?.setText(`${content.comicTitle}\n${content.comicDescription}`).setVisible(!hasTexture);
    this.layoutUI();
    this.hideLegacyInformationUI();
  }

  showComicCutIn(id, onClose = null) {
    const content = Object.values(ACT_CONTENT).find((item) => item.comic === id);
    if (!content) {
      return;
    }

    this.showSideComic(id);
    this.comicCutInOpen = false;
    this.comicCutInCallback = null;
    this.cutInPanel?.setVisible(false);
    this.cutInImage?.setVisible(false);
    this.cutInTitleText?.setVisible(false);
    this.cutInBodyText?.setVisible(false);
    if (onClose) {
      this.time.delayedCall(250, onClose);
    }
    this.layoutUI();
  }

  hideComicCutIn() {
    const callback = this.comicCutInCallback;
    this.comicCutInOpen = false;
    this.comicCutInCallback = null;
    this.cutInPanel?.setVisible(false);
    this.cutInImage?.setVisible(false);
    this.cutInTitleText?.setVisible(false);
    this.cutInBodyText?.setVisible(false);
    this.setPrompt("");
    if (callback) {
      callback();
    }
  }

  updateDialogSpeaker(name) {
    this.currentSpeaker = name || "Sistem";
    this.dialogNameTag?.setText(String(name || "ALAM").toUpperCase());
  }

  updateDialogText(text) {
    this.setDialog(text, true);
  }

  updateMissionText(text) {
    this.currentMission = text;
    this.updateHUD();
  }

  updateStatusText(text) {
    this.currentStatus = text;
    this.updateHUD();
  }

  updateScoreText() {
    this.updateHUD();
  }

  showInteractionHint(text) {
    this.setPrompt(text);
  }

  hideInteractionHint() {
    this.setPrompt("");
  }

  startAct2Quake() {
    if (this.flags.act2QuakeStarted) {
      return;
    }

    this.flags.act2QuakeStarted = true;
    this.hasAct2Triggered = true;
    this.canTriggerTeacherZone = false;
    this.isQuakeActive = true;
    this.setActState(ACT_STATES.ACT2_QUAKE_START);
    this.startQuakeShake(7000, 0.008);
    this.startDustOverlay();
    this.switchClassroomItemsToHazard();
    this.startNpcPanicEscape();

    this.time.delayedCall(1700, () => {
      if (this.actState === ACT_STATES.ACT2_QUAKE_START) {
        this.startAct3CabinetCollapse();
      }
    });
  }

  startQuakeShake(duration = 7000, intensity = 0.008) {
    this.cameras.main.shake(duration, intensity);
    this.quakePulseTimer?.remove(false);
    this.quakePulseTimer = this.time.addEvent({
      delay: 700,
      repeat: Math.max(1, Math.floor(duration / 700) - 1),
      callback: () => {
        this.cameras.main.shake(350, intensity * 0.75);
      },
    });
  }

  startAct3CabinetCollapse() {
    if (this.flags.act3CabinetCollapsed) {
      return;
    }

    this.flags.act3CabinetCollapsed = true;
    this.setActState(ACT_STATES.ACT3_CABINET_COLLAPSE);
    this.showComicCutIn("comic3");
    this.showAct2Debris();
    this.warningIcons.forEach((warning) => warning.setVisible(true));
    this.classroomObjects
      .filter((object) => ["cabinet", "cupboard", "bookshelf"].includes(object.textureKey))
      .forEach((object, index) => {
        this.tweens.add({
          targets: object.sprite,
          angle: index % 2 === 0 ? -7 : 7,
          duration: 180,
          yoyo: true,
          repeat: 5,
        });
        this.markHazardWarning(object);
      });
    this.cabinetSafeStartTime = null;
  }

  updateAct3CabinetCollapse(time) {
    const nearCabinet = this.hazardZones.some((zone) => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
      return distance <= zone.radius + 40;
    });

    if (nearCabinet) {
      this.cabinetSafeStartTime = null;
      this.showInteractionHint("PROMPT\nBahaya! Menjauh dari lemari dan rak tinggi.");
      if (time > this.hazardCooldownUntil) {
        this.score = Math.max(0, this.score - SCORE.hazardPenalty);
        this.hazardCooldownUntil = time + 950;
        this.updateScoreText();
        this.updateStatusText("Bahaya! Menjauh dari lemari.");
      }
      return;
    }

    this.showInteractionHint("PROMPT\nBagus. Bertahan di area tengah kelas.");
    this.cabinetSafeStartTime ??= time;
    if (time - this.cabinetSafeStartTime > 2000) {
      this.startAct4Aftershock();
    }
  }

  startAct4Aftershock() {
    this.setActState(ACT_STATES.ACT4_AFTERSHOCK_HIDE);
    this.showComicCutIn("comic4", () => {
      this.cameras.main.shake(3000, 0.011);
      this.updateStatusText("Gempa susulan! Segera berlindung.");
    });
  }

  updateAct4AftershockHide() {
    const nearestDesk = this.findNearestDesk();
    const isNearDesk = nearestDesk && nearestDesk.distance <= nearestDesk.zone.radius;
    this.safeMarker?.setVisible(Boolean(isNearDesk));

    if (isNearDesk) {
      this.safeMarker.setPosition(nearestDesk.zone.x, nearestDesk.zone.y - 76);
      this.showInteractionHint("PROMPT\nTekan E / Space untuk berlindung di bawah meja.");
    } else {
      this.showInteractionHint("PROMPT\nCari meja terdekat untuk Drop, Cover, Hold On.");
    }

    if (isNearDesk && this.consumeActionInput()) {
      this.flags.act4HiddenUnderDesk = true;
      this.isHolding = true;
      this.score = Math.min(150, this.score + SCORE.shelterBonus);
      this.updateScoreText();
      this.updateStatusText("Berhasil berlindung di bawah meja.");
      this.hideInteractionHint();
      this.safeMarker?.setVisible(false);
      this.time.delayedCall(2000, () => {
        this.isHolding = false;
        this.isQuakeActive = false;
        this.tweens.add({
          targets: this.dustOverlay,
          alpha: 0.18,
          duration: 500,
        });
        this.startAct5InjuredStudent();
      });
    }
  }

  startAct5InjuredStudent() {
    this.setActState(ACT_STATES.ACT5_INJURED_STUDENT);
    this.showComicCutIn("comic5");
    this.injuredStudent =
      this.npcs.find((npc) => npc.texture?.key === "murid3" && npc.visible) ||
      this.npcs.find((npc) => npc.visible && npc !== this.teacherNpc);

    if (this.injuredStudent) {
      this.stopNpcWalk(this.injuredStudent);
      this.injuredStudent.setVisible(true);
      this.injuredStudent.setFrame(12);
      this.injuredStudent.rescued = false;
      this.injuredStudent.hasEscaped = false;
      this.injuredDebris ??= this.add
        .image(this.injuredStudent.x + 34, this.injuredStudent.y + 34, "debris3")
        .setDisplaySize(82, 56)
        .setDepth(OBJECT_DEPTH + 3);
      this.injuredDebris.setPosition(this.injuredStudent.x + 34, this.injuredStudent.y + 34);
      this.injuredDebris.setVisible(true);
    }
  }

  updateAct5InjuredStudent() {
    if (!this.injuredStudent) {
      this.startAct6RescueAndMedic();
      return;
    }

    const nearInjured = this.distanceTo(this.injuredStudent) <= 120;
    this.showInteractionHint(nearInjured ? "PROMPT\nTekan E untuk memeriksa teman cedera." : "PROMPT\nDekati teman berkerudung yang cedera.");

    if (nearInjured && this.consumeActionInput()) {
      this.flags.act5InjuredStudentChecked = true;
      this.score = Math.min(150, this.score + 10);
      this.updateScoreText();
      this.startAct6RescueAndMedic();
    }
  }

  startAct6RescueAndMedic() {
    this.setActState(ACT_STATES.ACT6_RESCUE_AND_MEDIC);
    this.showComicCutIn("comic6");
    this.safeZone = { x: ROOM_CENTER.x - 385, y: FLOOR.y + 660, radius: 130 };
    this.safeZoneHighlight ??= this.add
      .circle(this.safeZone.x, this.safeZone.y, this.safeZone.radius, 0x32d66f, 0.22)
      .setStrokeStyle(5, 0x8dff9d, 0.95)
      .setDepth(UI_DEPTH - 12)
      .setVisible(false);
    this.safeZoneHighlight
      .setPosition(this.safeZone.x, this.safeZone.y)
      .setRadius(this.safeZone.radius)
      .setVisible(true);
    const medicZone = this.interactionZones.medic || CLASSROOM_LAYOUT.decor.medic;
    this.firstAidKitZone = {
      x: medicZone.x,
      y: medicZone.y,
      radius: 120,
    };
    this.firstAidKitMarker ??= this.add
      .image(this.firstAidKitZone.x, this.firstAidKitZone.y - 70, "safeMarker")
      .setDisplaySize(42, 42)
      .setDepth(UI_DEPTH - 10);
    this.firstAidKitMarker.setVisible(true);
  }

  updateAct6RescueAndMedic() {
    if (this.injuredStudent && !this.flags.act6StudentMovedToSafeZone) {
      this.moveInjuredStudentTowardPlayer();
      const movedSafe =
        Phaser.Math.Distance.Between(this.injuredStudent.x, this.injuredStudent.y, this.safeZone.x, this.safeZone.y) <=
        this.safeZone.radius;
      this.safeZoneHighlight?.setVisible(true).setPosition(this.safeZone.x, this.safeZone.y);
      this.safeMarker?.setVisible(true).setPosition(this.safeZone.x, this.safeZone.y - 60);
      this.showInteractionHint("PROMPT\nBawa teman cedera ke area aman yang ditandai.");

      if (!movedSafe) {
        return;
      }

      this.flags.act6StudentMovedToSafeZone = true;
      this.safeMarker?.setVisible(false);
      this.safeZoneHighlight?.setVisible(false);
      this.injuredDebris?.setVisible(false);
      this.updateMissionText("Ambil kotak P3K di lemari medic.");
      this.updateStatusText("Teman sudah berada di tempat aman.");
    }

    const nearMedic =
      this.firstAidKitZone &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, this.firstAidKitZone.x, this.firstAidKitZone.y) <=
        this.firstAidKitZone.radius;
    this.showInteractionHint(nearMedic ? "PROMPT\nTekan E / Space untuk mengambil P3K." : "PROMPT\nPergi ke kotak P3K.");

    if (nearMedic && this.consumeActionInput()) {
      this.flags.act6HasFirstAidKit = true;
      this.firstAidKitMarker?.setVisible(false);
      this.score = Math.min(150, this.score + SCORE.medicBonus);
      this.updateScoreText();
      this.startAct7FirstAidCall();
    }
  }

  startAct7FirstAidCall() {
    this.setActState(ACT_STATES.ACT7_FIRST_AID_CALL);
    this.showComicCutIn("comic7");
    this.updateMissionText("Beri P3K kepada teman cedera, lalu pergi ke alarm merah untuk menghubungi bantuan.");
  }

  updateAct7FirstAidCall() {
    if (!this.flags.act7FirstAidDone) {
      const nearInjured = this.injuredStudent && this.distanceTo(this.injuredStudent) <= 130;
      this.showInteractionHint(nearInjured ? "PROMPT\nTekan E / Space untuk memberi P3K." : "PROMPT\nDekati teman cedera untuk memberi P3K.");

      if (nearInjured && this.consumeActionInput()) {
        this.flags.act7FirstAidDone = true;
        this.score = Math.min(150, this.score + 15);
        this.updateScoreText();
        this.updateStatusText("Luka ringan sedang ditangani.");
        this.updateMissionText("Pergi ke alarm merah kelas untuk menghubungi bantuan.");
      }
      return;
    }

    if (this.flags.act7EmergencyCallDone) {
      return;
    }

    const alarmZone = this.interactionZones.alarm || CLASSROOM_LAYOUT.decor.alarm;
    const nearAlarm =
      Phaser.Math.Distance.Between(this.player.x, this.player.y, alarmZone.x, alarmZone.y) <=
      (alarmZone.radius || 130);
    this.safeMarker?.setVisible(!nearAlarm).setPosition(alarmZone.x, alarmZone.y - 72);
    this.showInteractionHint(
      nearAlarm
        ? "PROMPT\nTekan E / Space di alarm untuk memilih nomor bantuan."
        : "PROMPT\nPergi ke alarm merah untuk komunikasi bantuan."
    );

    if (nearAlarm && this.consumeActionInput()) {
      this.safeMarker?.setVisible(false);
      this.showEmergencyQuiz();
    }
  }

  startAct8EvacuateFriends() {
    this.setActState(ACT_STATES.ACT8_EVACUATE_FRIENDS);
    this.showComicCutIn("comic8");
    this.safeMarker?.setVisible(false);
    this.exitMarker?.setVisible(true);
    this.spawnTimsarOfficer();
    const evacuationCandidates = [
      this.injuredStudent,
      ...this.npcs.filter((npc) => npc.visible && npc !== this.teacherNpc && npc !== this.injuredStudent && !npc.hasEscaped),
    ].filter(Boolean);
    this.remainingFriends = evacuationCandidates
      .slice(0, EVACUATION_TARGET_COUNT)
      .map((npc) => {
        npc.setVisible(true);
        npc.rescued = false;
        return npc;
      });

    while (this.remainingFriends.length < EVACUATION_TARGET_COUNT) {
      const backup = this.npcs.find(
        (npc) =>
          npc !== this.teacherNpc &&
          !npc.hasEscaped &&
          !this.remainingFriends.includes(npc)
      );
      if (!backup) {
        break;
      }
      backup.setVisible(true);
      backup.setPosition(ROOM_CENTER.x - 260 + this.remainingFriends.length * 170, FLOOR.y + 560);
      backup.rescued = false;
      this.remainingFriends.push(backup);
    }
    this.rescuedCount = 0;
  }

  spawnTimsarOfficer() {
    if (!this.textures.exists("timsarOfficer")) {
      return;
    }

    const startX = DOOR_POSITION.x;
    const startY = DOOR_POSITION.y;
    const centerX = ROOM_CENTER.x;
    const centerY = FLOOR.y + FLOOR.height * 0.52;

    if (!this.timsarOfficer) {
      this.timsarOfficer = this.add
        .sprite(startX, startY, "timsarOfficer", 12)
        .setDisplaySize(126, 126)
        .setDepth(PLAYER_DEPTH - 1);
    }

    this.timsarOfficerReady = false;
    this.timsarOfficer.setVisible(true).setAlpha(1).setPosition(startX, startY);
    this.timsarOfficer.anims.play("timsar-walk-up", true);
    this.tweens.add({
      targets: this.timsarOfficer,
      x: centerX,
      y: centerY,
      duration: 1150,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.timsarOfficerReady = true;
        this.timsarOfficer?.anims.stop();
        this.timsarOfficer?.setFrame(0);
      },
    });
  }

  updateTimsarFollower() {
    if (!this.timsarOfficer?.visible || !this.timsarOfficerReady || this.actState !== ACT_STATES.ACT8_EVACUATE_FRIENDS) {
      return;
    }

    const targetX = Phaser.Math.Clamp(this.player.x - 96, FLOOR.x + 55, FLOOR.x + FLOOR.width - 55);
    const targetY = Phaser.Math.Clamp(this.player.y + 44, FLOOR.y + 55, FLOOR.y + FLOOR.height - 55);
    const dx = targetX - this.timsarOfficer.x;
    const dy = targetY - this.timsarOfficer.y;
    const moving = Math.abs(dx) + Math.abs(dy) > 6;
    this.timsarOfficer.x = Phaser.Math.Linear(this.timsarOfficer.x, targetX, 0.075);
    this.timsarOfficer.y = Phaser.Math.Linear(this.timsarOfficer.y, targetY, 0.075);
    this.timsarOfficer.setDepth(this.player.y > this.timsarOfficer.y ? PLAYER_DEPTH - 1 : PLAYER_DEPTH + 1);

    if (!moving) {
      this.timsarOfficer.anims.stop();
      this.timsarOfficer.setFrame(0);
      return;
    }

    const direction = Math.abs(dx) > Math.abs(dy)
      ? dx < 0 ? "left" : "right"
      : dy < 0 ? "up" : "down";
    this.timsarOfficer.anims.play(`timsar-walk-${direction}`, true);
  }

  updateAct8EvacuateFriends() {
    const friend = this.remainingFriends.find((npc) => !npc.rescued && this.distanceTo(npc) <= 120);
    this.showInteractionHint(
      friend
        ? "PROMPT\nTekan E untuk mengarahkan teman ke pintu."
        : `PROMPT\nTeman diarahkan: ${this.rescuedCount} / ${EVACUATION_TARGET_COUNT}`
    );

    if (friend && this.consumeActionInput()) {
      friend.rescued = true;
      this.rescuedCount += 1;
      this.updateStatusText("Teman berhasil diarahkan ke rute evakuasi.");
      this.updateMissionText(`Teman diarahkan: ${this.rescuedCount} / ${EVACUATION_TARGET_COUNT}`);
      this.escapeFrontStudentToDoor(friend, 0);
    }

    if (this.rescuedCount >= EVACUATION_TARGET_COUNT && !this.flags.act8AllFriendsGuided) {
      this.flags.act8AllFriendsGuided = true;
      this.exitUnlocked = true;
      this.exitZone.door.setAlpha(1);
      this.updateMissionText("Semua teman sudah diarahkan. Pergi ke pintu evakuasi.");
      this.updateStatusText("Pintu evakuasi aktif.");
    }

    if (this.exitUnlocked && this.isPlayerNearExit()) {
      this.startAct9Complete();
    }
  }

  startAct9Complete() {
    if (this.flags.act9Complete) {
      return;
    }

    this.flags.act9Complete = true;
    this.setActState(ACT_STATES.ACT9_COMPLETE);
    this.showComicCutIn("comic9");
    this.completeSimulation();
  }

  distanceTo(target) {
    if (!target) {
      return Number.POSITIVE_INFINITY;
    }
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
  }

  moveInjuredStudentTowardPlayer() {
    if (!this.injuredStudent) {
      return;
    }

    const distance = this.distanceTo(this.injuredStudent);
    if (distance > 180) {
      return;
    }

    const targetX = this.player.x - 42;
    const targetY = this.player.y + 34;
    this.injuredStudent.x = Phaser.Math.Linear(this.injuredStudent.x, targetX, 0.035);
    this.injuredStudent.y = Phaser.Math.Linear(this.injuredStudent.y, targetY, 0.035);
  }

  handlePrematureExitAttempt() {
    if (this.exitUnlocked && this.flags.act8AllFriendsGuided) {
      return;
    }

    const message =
      this.actState === ACT_STATES.ACT2_QUAKE_START || this.actState === ACT_STATES.ACT3_CABINET_COLLAPSE || this.actState === ACT_STATES.ACT4_AFTERSHOCK_HIDE
        ? "Jangan keluar saat guncangan masih terjadi!"
        : "Jangan keluar sendiri. Selesaikan objective dan arahkan teman dulu.";
    this.showInteractionHint(`PROMPT\n${message}`);

    const now = this.time.now;
    if (now > this.routeHazardCooldownUntil) {
      this.score = Math.max(0, this.score - SCORE.hazardPenalty);
      this.routeHazardCooldownUntil = now + 1200;
      this.updateScoreText();
      this.updateStatusText(message);
    }
  }

  applyActHazardPenalties(time) {
    if (![ACT_STATES.ACT2_QUAKE_START, ACT_STATES.ACT3_CABINET_COLLAPSE, ACT_STATES.ACT4_AFTERSHOCK_HIDE].includes(this.actState)) {
      return;
    }

    this.applyHazardPenalty(time);
  }

  showEmergencyQuiz() {
    if (this.quizOpen) {
      return;
    }

    this.quizOpen = true;
    this.quizFeedback = "";
    this.quizSelectedIndex = 0;
    this.quizOptions = [];
    this.clearEmergencyQuiz();

    const mapBounds = this.getFixedMapBounds();
    const quizW = Math.min(720, mapBounds.width - 80);
    const quizH = 286;
    const quizX = mapBounds.x + mapBounds.width / 2 - quizW / 2;
    const quizY = Math.max(24, mapBounds.y + mapBounds.height / 2 - quizH / 2);
    const panel = this.add
      .rectangle(quizX, quizY, quizW, quizH, 0x102316, 0.98)
      .setOrigin(0, 0)
      .setStrokeStyle(3, UI_COLORS.strokeBright, 1)
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 1500);
    const titleBar = this.add
      .rectangle(quizX + 16, quizY + 14, quizW - 32, 48, 0x355e3b, 0.98)
      .setOrigin(0, 0)
      .setStrokeStyle(2, UI_COLORS.strokeBright, 1)
      .setScrollFactor(0)
      .setDepth(UI_DEPTH + 1501);
    const title = this.createReadableText(quizX + 34, quizY + 26, "PILIH NOMOR DARURAT", {
      fontSize: "18px",
      color: "#fff7c9",
      wrapWidth: quizW - 68,
      depth: UI_DEPTH + 1502,
    });
    const question = this.createReadableText(
      quizX + 24,
      quizY + 78,
      "Saat terjadi keadaan darurat dan kamu perlu bantuan cepat, nomor umum yang benar adalah:",
      {
        fontSize: "17px",
        color: "#fff0b7",
        wrapWidth: quizW - 48,
        depth: UI_DEPTH + 1501,
        lineSpacing: 7,
      }
    );
    const hint = this.createReadableText(quizX + 24, quizY + 122, "Gunakan Arrow/WASD untuk memilih, lalu tekan E atau Space.", {
      fontSize: "14px",
      color: "#fff0b7",
      wrapWidth: quizW - 48,
      depth: UI_DEPTH + 1501,
    });

    this.quizElements.push(panel, titleBar, title, question, hint);
    [
      ["A", "112"],
      ["B", "123"],
      ["C", "404"],
      ["D", "9999"],
    ].forEach(([letter, value], index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = quizX + 24 + col * (quizW / 2 - 12);
      const y = quizY + 158 + row * 52;
      const button = this.add
        .rectangle(x, y, quizW / 2 - 42, 42, 0x223b22, 0.98)
        .setOrigin(0, 0)
        .setStrokeStyle(2, UI_COLORS.strokeBright, 1)
        .setScrollFactor(0)
        .setDepth(UI_DEPTH + 1501)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => this.setEmergencyQuizSelection(index))
        .on("pointerdown", () => {
          this.setEmergencyQuizSelection(index);
          this.answerEmergencyQuiz(letter);
        });
      const label = this.createReadableText(x + 14, y + 10, `${letter}. ${value}`, {
        fontSize: "17px",
        color: "#fff6ce",
        wrapWidth: quizW / 2 - 68,
        depth: UI_DEPTH + 1502,
      });
      this.quizElements.push(button, label);
      this.quizOptions.push({ letter, value, button, label });
    });

    this.quizFeedbackText = this.createReadableText(quizX + 22, quizY + quizH - 34, "", {
      fontSize: "15px",
      color: "#ffb36b",
      wrapWidth: quizW - 44,
      depth: UI_DEPTH + 1502,
    });
    this.quizElements.push(this.quizFeedbackText);
    this.setEmergencyQuizSelection(0);
  }

  updateEmergencyQuizInput() {
    const moveLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keys.A);
    const moveRight = Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keys.D);
    const moveUp = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.W);
    const moveDown = Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keys.S);

    if (moveLeft) {
      this.setEmergencyQuizSelection(this.quizSelectedIndex - 1);
    } else if (moveRight) {
      this.setEmergencyQuizSelection(this.quizSelectedIndex + 1);
    } else if (moveUp) {
      this.setEmergencyQuizSelection(this.quizSelectedIndex - 2);
    } else if (moveDown) {
      this.setEmergencyQuizSelection(this.quizSelectedIndex + 2);
    }

    if (this.consumeActionInput()) {
      const selected = this.quizOptions[this.quizSelectedIndex];
      if (selected) {
        this.answerEmergencyQuiz(selected.letter);
      }
    }
  }

  setEmergencyQuizSelection(nextIndex) {
    if (!this.quizOptions.length) {
      return;
    }

    const optionCount = this.quizOptions.length;
    this.quizSelectedIndex = ((nextIndex % optionCount) + optionCount) % optionCount;
    this.quizOptions.forEach((option, index) => {
      const selected = index === this.quizSelectedIndex;
      option.button
        .setFillStyle(selected ? 0x477a42 : 0x223b22, 0.98)
        .setStrokeStyle(selected ? 4 : 2, selected ? 0xffffff : UI_COLORS.strokeBright, 1);
      option.label.setColor(selected ? "#ffffff" : "#fff6ce");
      option.label.setText(`${selected ? "> " : ""}${option.letter}. ${option.value}`);
    });
  }

  flashEmergencyQuizSelection() {
    const selected = this.quizOptions[this.quizSelectedIndex];
    if (!selected) {
      return;
    }

    selected.button.setFillStyle(0x7a3b2f, 0.98);
    this.time.delayedCall(180, () => this.setEmergencyQuizSelection(this.quizSelectedIndex));
  }

  answerEmergencyQuiz(letter) {
    if (!this.quizOpen) {
      return;
    }

    if (letter === "A") {
      this.flags.act7EmergencyCallDone = true;
      this.quizOpen = false;
      this.score = Math.min(150, this.score + 20);
      this.updateScoreText();
      this.updateStatusText("Bantuan berhasil dihubungi.");
      this.clearEmergencyQuiz();
      this.startAct8EvacuateFriends();
      return;
    }

    this.score = Math.max(0, this.score - SCORE.hazardPenalty);
    this.updateScoreText();
    this.quizFeedback = "Nomor tidak tepat. Coba lagi.";
    this.updateStatusText("Nomor tidak tepat. Coba ingat nomor darurat umum.");
    this.quizFeedbackText?.setText(this.quizFeedback);
    this.flashEmergencyQuizSelection();
  }

  clearEmergencyQuiz() {
    this.quizElements.forEach((object) => object?.destroy?.());
    this.quizElements = [];
    this.quizFeedbackText = null;
    this.quizOptions = [];
    this.quizSelectedIndex = 0;
  }

  startDustOverlay() {
    if (!this.dustOverlay) {
      return;
    }

    this.tweens.add({
      targets: this.dustOverlay,
      alpha: 0.48,
      duration: 500,
    });
  }

  updateDustOverlay() {
    if (!this.dustOverlay || !this.isQuakeActive) {
      return;
    }

    if ("tilePositionX" in this.dustOverlay) {
      this.dustOverlay.tilePositionX += 0.7;
      this.dustOverlay.tilePositionY += 0.3;
    }
  }

  switchClassroomItemsToHazard() {
    if (this.act2FurnitureHazardApplied) {
      return;
    }

    this.act2FurnitureHazardApplied = true;
    this.warningIcons.forEach((warning) => warning.setVisible(true));
    this.showAct2Debris();

    this.classroomObjects.forEach((object) => {
      if (!object.canBecomeHazard) {
        return;
      }

      if (object.hazardKey && this.textures.exists(object.hazardKey)) {
        object.sprite.setTexture(object.hazardKey);
        this.markHazardWarning(object);
        return;
      }

      this.markHazardWarning(object);
    });
  }

  showAct2Debris() {
    this.postQuakeHazards.forEach((hazard) => hazard.setVisible(true));
  }

  markHazardWarning(object) {
    const sprite = object.sprite;
    if (!object.warning) {
      object.warning = this.add
        .image(sprite.x, sprite.y - Math.max(34, sprite.displayHeight * 0.48), "warningIcon")
        .setDisplaySize(30, 30)
        .setDepth(OBJECT_DEPTH + 18);
    }
  }

  startNpcPanicEscape() {
    this.setStatus("Beberapa orang panik menuju pintu. Jangan ikuti saat guncangan masih berlangsung!");

    if (this.teacherNpc) {
      this.playNpcWalk(this.teacherNpc, "down");
      this.tweens.add({
        targets: this.teacherNpc,
        x: TEACHER_POSITION.x,
        y: FLOOR.y + FLOOR.height * 0.55,
        duration: 900,
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.playNpcWalk(this.teacherNpc, "right");
          this.tweens.add({
            targets: this.teacherNpc,
            x: DOOR_POSITION.x,
            y: FLOOR.y + FLOOR.height * 0.55,
            duration: 950,
            ease: "Sine.easeInOut",
            onComplete: () => {
              this.playNpcWalk(this.teacherNpc, "down");
              this.tweens.add({
                targets: this.teacherNpc,
                x: DOOR_POSITION.x,
                y: DOOR_POSITION.y,
                duration: 800,
                ease: "Sine.easeInOut",
                onComplete: () => this.hideEscapedNpc(this.teacherNpc),
              });
            },
          });
        },
      });
    }

    const escapeStudents = [this.panicStudentNpc, ...this.panicFrontNpcs].filter(Boolean).slice(0, 3);
    escapeStudents.forEach((npc, index) => this.escapeFrontStudentToDoor(npc, index * 180));
    this.scatterClassroomStudents(new Set(escapeStudents));
  }

  scatterClassroomStudents(excludedStudents = new Set()) {
    const rng = this.getRunRng();
    const students = this.npcs.filter(
      (npc) => npc && npc !== this.teacherNpc && npc.visible && !npc.hasEscaped && !excludedStudents.has(npc)
    );

    students.forEach((npc, index) => {
      const target = this.getRandomFloorPoint({ marginX: 150, marginTop: 150, marginBottom: 115 });
      const direction = Math.abs(target.x - npc.x) > Math.abs(target.y - npc.y)
        ? target.x < npc.x ? "left" : "right"
        : target.y < npc.y ? "up" : "down";
      this.playNpcWalk(npc, direction);
      this.tweens.add({
        targets: npc,
        x: target.x,
        y: target.y,
        duration: rng.between(700, 1250),
        delay: index * 90,
        ease: "Sine.easeInOut",
        onComplete: () => this.stopNpcWalk(npc, index),
      });
    });
  }

  stopNpcWalk(npc, index = 0) {
    npc.walkTween?.stop();
    if (npc.baseScaleY) {
      npc.setScale(npc.scaleX, npc.baseScaleY);
    }
    npc.setFrame([0, 4, 8, 12][index % 4]);
  }

  escapeFrontStudentToDoor(npc, delay = 0) {
    this.playNpcWalk(npc, npc.x < DOOR_POSITION.x ? "right" : "left");
    this.tweens.add({
      targets: npc,
      x: DOOR_POSITION.x + (npc.x < DOOR_POSITION.x ? -32 : 32),
      y: npc.y + 60,
      duration: 900,
      delay,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.playNpcWalk(npc, "down");
        this.tweens.add({
          targets: npc,
          x: DOOR_POSITION.x,
          y: DOOR_POSITION.y,
          duration: 900,
          ease: "Sine.easeInOut",
          onComplete: () => this.hideEscapedNpc(npc),
        });
      },
    });
  }

  playNpcWalk(npc, direction) {
    const frames = {
      down: 1,
      left: 5,
      right: 9,
      up: 13,
    };
    npc.setFrame(frames[direction] ?? 1);
    npc.baseScaleY ??= npc.scaleY;
    npc.setScale(npc.scaleX, npc.baseScaleY);

    npc.walkTween?.stop();
    npc.walkTween = this.tweens.add({
      targets: npc,
      scaleY: npc.baseScaleY * 0.94,
      yoyo: true,
      repeat: -1,
      duration: 140,
    });
  }

  hideEscapedNpc(npc) {
    npc.walkTween?.stop();
    if (npc.baseScaleY) {
      npc.setScale(npc.scaleX, npc.baseScaleY);
    }
    npc.hasEscaped = true;
    npc.setVisible(false);
  }

  updateSimulationTriggers(time) {
    if (this.gameState === STATES.QUAKE_START || this.gameState === STATES.ACTION_DCH) {
      this.applyHazardPenalty(time);
    }

    if (this.gameState === STATES.EVACUATION_ROUTE || this.gameState === STATES.FINAL_EXIT) {
      this.applyRouteHazardPenalty(time);
    }

    this.updateCurrentStateInteraction();
  }

  updateCurrentStateInteraction() {
    this.safeMarker?.setVisible(false);

    if (this.gameState !== STATES.FINAL_EXIT && this.gameState !== STATES.COMPLETE && this.isPlayerNearExit()) {
      const doorMessage =
        this.gameState === STATES.QUAKE_START || this.gameState === STATES.ACTION_DCH
          ? "Jangan keluar saat guncangan masih terjadi!"
          : "Pintu belum aktif. Selesaikan instruksi dulu.";
      this.setPrompt(`PROMPT\n${doorMessage}`);
      if (this.consumeActionInput()) {
        this.showComic(doorMessage);
      }
      return;
    }

    if (this.gameState === STATES.INTRO_TUTORIAL) {
      this.promptZone("instruction", "PROMPT\nTekan E untuk mulai tutorial", () => {
        this.progress.tutorialDone = true;
        this.showComic(COMIC_TRIGGERS.tutorialIntro, () => {
          this.advanceState(STATES.BASICS_RECALL);
        });
      });
      return;
    }

    if (this.gameState === STATES.BASICS_RECALL) {
      this.promptZone("basics", "PROMPT\nTekan E untuk mengingat materi gempa", () => {
        this.progress.basicsDone = true;
        this.showComic(COMIC_TRIGGERS.basicsGempa, () => {
          this.advanceState(STATES.PREPARE_CHECK);
        });
      });
      return;
    }

    if (this.gameState === STATES.PREPARE_CHECK) {
      this.promptZone("kit", "PROMPT\nTekan E untuk cek tas siaga", () => {
        this.progress.preparationDone = true;
        this.progress.hasEmergencyKit = true;
        this.showComic(COMIC_TRIGGERS.preparationKit, () => {
          this.advanceState(STATES.MITIGATION_SCAN);
        });
      });
      return;
    }

    if (this.gameState === STATES.MITIGATION_SCAN) {
      this.updateMitigationScan();
      return;
    }

    if (this.gameState === STATES.ACTION_DCH) {
      this.updateDropCoverHold();
      return;
    }

    if (this.gameState === STATES.COMMUNICATION_CHECK) {
      this.promptZone("communication", "PROMPT\nTekan E untuk dengar instruksi guru", () => {
        this.progress.communicationDone = true;
        this.showComic(COMIC_TRIGGERS.communicationTeacher, () => {
          this.advanceState(STATES.MEDIC_CHECK);
        });
      });
      return;
    }

    if (this.gameState === STATES.MEDIC_CHECK) {
      this.promptZone("medic", "PROMPT\nTekan E untuk cek teman terluka", () => {
        if (!this.progress.hasEmergencyKit) {
          this.showComic("Kamu belum membawa P3K. Cari perlengkapan penting dulu.");
          return;
        }

        this.progress.medicDone = true;
        this.score = Math.min(100, this.score + SCORE.medicBonus);
        this.refreshScore();
        this.showComic(COMIC_TRIGGERS.medicP3k, () => {
          this.advanceState(STATES.EVACUATION_ROUTE);
        });
      });
      return;
    }

    if (this.gameState === STATES.EVACUATION_ROUTE) {
      this.promptZone("routePoster", "PROMPT\nTekan E untuk baca jalur evakuasi", () => {
        this.progress.routeKnown = true;
        this.showComic(COMIC_TRIGGERS.evacuationRoute, () => {
          this.advanceState(STATES.FINAL_EXIT);
        });
      });
      return;
    }

    if (this.gameState === STATES.FINAL_EXIT) {
      this.updateFinalExit();
    }
  }

  updateMitigationScan() {
    const prompts = [];

    if (!this.progress.scanWindow && this.isPlayerNear("window")) {
      prompts.push("E: scan jendela");
      if (this.consumeActionInput()) {
        this.progress.scanWindow = true;
        this.showComic(COMIC_TRIGGERS.windowHazard);
        return;
      }
    }

    if (!this.progress.scanCabinet && this.isPlayerNear("cabinet")) {
      prompts.push("E: scan rak/lemari");
      if (this.consumeActionInput()) {
        this.progress.scanCabinet = true;
        this.showComic(COMIC_TRIGGERS.cabinetHazard);
        return;
      }
    }

    const nearestDesk = this.findNearestDesk();
    const nearDesk = nearestDesk && nearestDesk.distance <= nearestDesk.zone.radius;
    if (!this.progress.scanDesk && nearDesk) {
      prompts.push("E: scan meja aman");
      if (this.consumeActionInput()) {
        this.progress.scanDesk = true;
        this.showComic(COMIC_TRIGGERS.deskSafe);
        return;
      }
    }

    if (nearDesk) {
      this.safeMarker?.setVisible(true);
      this.safeMarker?.setPosition(nearestDesk.zone.x, nearestDesk.zone.y - 76);
    }

    this.setPrompt(prompts.length ? `PROMPT\n${prompts.join("\n")}` : "");

    if (this.progress.scanWindow && this.progress.scanCabinet && this.progress.scanDesk) {
      this.progress.mitigationDone = true;
      this.setPrompt("");
      this.advanceState(STATES.QUAKE_START);
    }
  }

  updateDropCoverHold() {
    const nearestDesk = this.findNearestDesk();
    const isNearDesk = nearestDesk && nearestDesk.distance <= nearestDesk.zone.radius;

    this.safeMarker?.setVisible(Boolean(isNearDesk));
    this.setPrompt(isNearDesk ? "PROMPT\nTekan E / Space untuk Drop-Cover-Hold" : "");

    if (isNearDesk) {
      this.safeMarker.setPosition(nearestDesk.zone.x, nearestDesk.zone.y - 76);
    }

    if (isNearDesk && this.consumeActionInput()) {
      this.shelterUnderDesk();
    }
  }

  updateFinalExit() {
    this.exitMarker?.setVisible(true);
    this.setPrompt("PROMPT\nPergi ke pintu evakuasi");

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.exitZone.x,
      this.exitZone.y
    );

    if (distance > this.exitZone.radius) {
      return;
    }

    if (!this.canExit()) {
      this.showComic("Kamu belum siap evakuasi. Selesaikan instruksi dulu.");
      return;
    }

    this.completeSimulation();
  }

  isPlayerNearExit() {
    if (!this.exitZone) {
      return false;
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.exitZone.x,
      this.exitZone.y
    );
    return distance <= this.exitZone.radius;
  }

  applyHazardPenalty(time) {
    const nearHazard = this.hazardZones.some((zone) => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
      return distance <= zone.radius;
    });

    if (!nearHazard || time < this.hazardCooldownUntil) {
      return;
    }

    this.score = Math.max(0, this.score - SCORE.hazardPenalty);
    this.hazardCooldownUntil = time + 850;
    this.refreshScore();
    this.setStatus("Bahaya dekat!");
  }

  findNearestDesk() {
    let nearest = null;

    this.deskZones.forEach((zone) => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
      if (!nearest || distance < nearest.distance) {
        nearest = { zone, distance };
      }
    });

    return nearest;
  }

  consumeActionInput() {
    const globalKeys = this.getGlobalInputState();
    const hasGlobalAction = Boolean(globalKeys.actionQueued);

    if (hasGlobalAction) {
      globalKeys.actionQueued = false;
    }

    return (
      Phaser.Input.Keyboard.JustDown(this.keys.E) ||
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE) ||
      hasGlobalAction
    );
  }

  isActionInputPressed() {
    // ===== CHECK IF ACTION KEY IS CURRENTLY HELD (Not just pressed) =====
    return this.keys.E.isDown || this.keys.SPACE.isDown || Boolean(this.getGlobalInputState().actionQueued);
  }

  // ===== IMPROVED ITEM INTERACTION SYSTEM =====
  checkItemInteraction(itemZones, options = {}) {
    /**
     * Advanced item interaction checker dengan multiple features:
     * @param {Array} itemZones - Array of zones: [{x, y, radius}, ...]
     * @param {Object} options - Configuration:
     *   - onNear: callback saat player dekat
     *   - onFar: callback saat player jauh
     *   - onInteract: callback saat player interact (E/SPACE)
     *   - showPrompt: boolean untuk show/hide prompt
     *   - promptText: custom prompt text
     *   - interactRadius: optional override untuk interaction radius
     */

    const items = Array.isArray(itemZones) ? itemZones : [itemZones];
    const { isNear, distance } = this.getPlayerProximityToZones(items);

    // Handle far callback
    if (!isNear && options.onFar) {
      options.onFar({ distance });
    }

    // Handle near callback
    if (isNear && options.onNear) {
      options.onNear({ distance });
    }

    // Show prompt jika dekat
    if (options.showPrompt !== false && isNear) {
      this.setPrompt(options.promptText || "PROMPT\nTekan E / Space");
    } else if (options.showPrompt !== false) {
      this.setPrompt("");
    }

    // Check interaction
    if (isNear && this.consumeActionInput() && options.onInteract) {
      options.onInteract();
      return true;
    }

    return false;
  }

  // ===== SAFE ZONE & SHELTER INTERACTION =====
  checkShelterInteraction(shelterZones) {
    /**
     * Specialized interaction untuk item perlindungan (meja, area aman)
     */
    const items = Array.isArray(shelterZones) ? shelterZones : [shelterZones];
    const { isNear, distance } = this.getPlayerProximityToZones(items);

    if (isNear && this.consumeActionInput()) {
      return {
        interacted: true,
        distance,
        isNear,
      };
    }

    return {
      interacted: false,
      distance,
      isNear,
    };
  }

  // ===== STATE-BASED INTERACTION RESPONSE =====
  respondToInteractionState(stateKey, response) {
    /**
     * Consistent response untuk berbagai interaction state
     */
    const responses = {
      success: () => {
        this.score = Math.min(150, this.score + 20);
        this.updateScoreText();
        this.updateStatusText("Aksi berhasil!");
      },
      warning: () => {
        this.updateStatusText("Hati-hati! Area berbahaya.");
      },
      error: () => {
        this.updateStatusText("Tidak bisa melakukan aksi di sini.");
      },
      blocked: () => {
        this.updateStatusText("Terlalu dekat dengan bahaya!");
      },
    };

    if (responses[stateKey]) {
      responses[stateKey]();
    }
  }

  promptZone(zoneKey, prompt, onInteract) {
    // ===== CHECK PLAYER PROXIMITY =====
    const zone = this.interactionZones[zoneKey];
    if (!zone) {
      this.setPrompt("");
      return false;
    }

    const zones = Array.isArray(zone) ? zone : [zone];
    const { isNear, distance } = this.getPlayerProximityToZones(zones);

    // ===== HANDLE PROMPT DISPLAY & INTERACTION =====
    if (!isNear) {
      this.setPrompt("");
      return false;
    }

    // Show prompt ketika player dekat
    this.setPrompt(prompt);

    // Check untuk action input
    if (this.consumeActionInput()) {
      this.setPrompt("");
      onInteract();
      return true;
    }

    return false;
  }

  isPlayerNear(zoneKey) {
    // ===== IMPROVED PROXIMITY CHECK =====
    const zone = this.interactionZones[zoneKey];
    if (!zone) {
      return false;
    }

    const zones = Array.isArray(zone) ? zone : [zone];
    const { isNear } = this.getPlayerProximityToZones(zones);
    return isNear;
  }

  getPlayerProximityToZones(zones) {
    // ===== HELPER: Calculate proximity to multiple zones =====
    let nearestDistance = Infinity;
    let isNear = false;

    zones.forEach((item) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, 
        this.player.y, 
        item.x, 
        item.y
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
      }

      if (distance <= item.radius) {
        isNear = true;
      }
    });

    return { isNear, distance: nearestDistance };
  }

  getDistanceToZone(zoneKey) {
    // ===== GET EXACT DISTANCE TO ZONE (For debugging) =====
    const zone = this.interactionZones[zoneKey];
    if (!zone) {
      return Infinity;
    }

    const zones = Array.isArray(zone) ? zone : [zone];
    const { distance } = this.getPlayerProximityToZones(zones);
    return distance;
  }

  showComic(message, onClose = null) {
    this.comicOpen = true;
    this.comicCallback = onClose;
    this.setPrompt("PROMPT\nTekan E / Space untuk lanjut");
    this.setDialog(message, true);
  }

  closeComic() {
    const callback = this.comicCallback;
    this.comicOpen = false;
    this.comicCallback = null;
    this.setPrompt("");
    this.setDialog("", false);

    if (callback) {
      callback();
    }
  }

  canExit() {
    return Boolean(
      this.progress.tutorialDone &&
        this.progress.basicsDone &&
        this.progress.preparationDone &&
        this.progress.mitigationDone &&
        this.progress.actionDone &&
        this.progress.communicationDone &&
        this.progress.medicDone &&
        this.progress.routeKnown
    );
  }

  advanceState(nextState) {
    this.gameState = nextState;

    if (nextState === STATES.BASICS_RECALL) {
      this.setMission("Ingat kembali: apa itu gempa? Dekati papan tulis lalu tekan E.", "Basics");
      return;
    }

    if (nextState === STATES.PREPARE_CHECK) {
      this.setMission("Cek perlengkapan penting sebelum simulasi dimulai.", "Preparation");
      return;
    }

    if (nextState === STATES.MITIGATION_SCAN) {
      this.setMission("Kenali 3 sumber bahaya: jendela, rak/lemari, dan meja aman.", "Mitigation");
      return;
    }

    if (nextState === STATES.QUAKE_START) {
      this.setMission("Simulasi gempa dimulai dalam 3 detik.", "Siap Gempa");
      this.time.delayedCall(3000, () => {
        if (this.gameState === STATES.QUAKE_START) {
          this.startQuake();
        }
      });
      return;
    }

    if (nextState === STATES.COMMUNICATION_CHECK) {
      this.setMission("Gempa reda. Dekati guru dan dengarkan instruksi.", "Communication");
      return;
    }

    if (nextState === STATES.MEDIC_CHECK) {
      this.setMission("Cek kondisi sekitar sebelum keluar.", "Medic Station");
      return;
    }

    if (nextState === STATES.EVACUATION_ROUTE) {
      this.setMission("Temukan rute evakuasi yang aman menuju pintu keluar.", "Evacuation");
      return;
    }

    if (nextState === STATES.FINAL_EXIT) {
      this.exitMarker?.setVisible(true);
      this.exitZone.door.setAlpha(1);
      this.setMission("Pintu evakuasi terbuka. Keluar dengan tertib.", "Final Exit");
    }
  }

  startQuake() {
    this.gameState = STATES.ACTION_DCH;
    this.quakeStarted = true;
    this.setMission("Cari meja terdekat lalu tekan E / Space untuk Drop-Cover-Hold.", "Gempa");
    this.warningIcons.forEach((warning) => warning.setVisible(true));
    this.cameras.main.shake(1800, 0.012);
    this.showComic(COMIC_TRIGGERS.quakeStart);
  }

  shelterUnderDesk() {
    this.isHolding = true;
    this.progress.actionDone = true;
    this.score = Math.min(100, this.score + SCORE.shelterBonus);
    this.refreshScore();
    this.safeMarker?.setVisible(false);
    this.setPrompt("");
    this.setMission("Bagus. Tahan posisi sampai guncangan reda.", "Drop-Cover-Hold");
    this.setDialog(COMIC_TRIGGERS.holdOn, true);
    this.cameras.main.shake(450, 0.006);

    this.time.delayedCall(3000, () => {
      if (this.isHolding) {
        this.isHolding = false;
        this.setDialog("", false);
        this.applyQuakeDamageState();
        this.warningIcons.forEach((warning) => warning.setVisible(false));
        this.advanceState(STATES.COMMUNICATION_CHECK);
      }
    });
  }

  applyRouteHazardPenalty(time) {
    const nearDamage = this.postQuakeHazards.some((hazard) => {
      if (!hazard.visible) {
        return false;
      }

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, hazard.x, hazard.y);
      return distance <= 70;
    });

    if (!nearDamage || time < this.routeHazardCooldownUntil) {
      return;
    }

    this.score = Math.max(0, this.score - SCORE.hazardPenalty);
    this.routeHazardCooldownUntil = time + 950;
    this.refreshScore();
    this.setStatus("Hati-hati! Hindari jalur rusak.");
  }

  applyQuakeDamageState() {
    if (this.damageStateApplied) {
      return;
    }

    this.damageStateApplied = true;
    this.postQuakeHazards.forEach((hazard) => hazard.setVisible(true));
    this.setStatus("Ruang kelas rusak, segera evakuasi!");
  }

  completeSimulation() {
    if (this.gameState === STATES.COMPLETE) {
      return;
    }

    this.gameState = STATES.COMPLETE;
    this.player.setVelocity(0, 0);
    this.setPrompt("");
    this.exitMarker?.setVisible(false);
    this.safeMarker?.setVisible(false);
    this.safeZoneHighlight?.setVisible(false);
    this.setMission("Simulasi selesai.", "Selesai");
    this.setDialog(COMIC_TRIGGERS.endingComplete, true);

    const reward = "Badge Siaga Gempa Level 1";
    this.emitHudEvent("eduquake:toast", { text: `Misi selesai. Skor: ${this.score}` });
    this.emitHudEvent("eduquake:complete", {
      score: this.score,
      reward,
      returnPath: "/#modul-belajar",
    });

    this.submitResult({
      scene: "classroom",
      score: this.score,
      completed: true,
      reward,
    });
  }

  async submitResult(payload) {
    if (this.resultSubmitted) {
      return;
    }

    this.resultSubmitted = true;

    try {
      await fetch("/api/simulation-results/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("Simulation result endpoint unavailable. Completion remains valid.", error);
    }
  }

  setMission(mission, status) {
    this.currentMission = mission;
    this.setStatus(status);
  }

  setStatus(status) {
    this.currentStatus = status;
    this.updateHUD();
  }

  refreshScore() {
    this.updateHUD();
  }

  setPrompt(prompt) {
    this.currentPrompt = prompt;
    this.updateHUD();
  }

  setDialog(message, visible) {
    this.dialogVisible = visible;
    this.dialogPanel?.setVisible(visible);
    this.dialogPortraitPanel?.setVisible(visible);
    this.dialogPortrait?.setVisible(visible);
    this.dialogNameTag?.setVisible(visible);
    this.dialogArrowText?.setVisible(visible);
    this.dialogText?.setVisible(visible);
    this.dialogText?.setText(message);
    this.emitDialogueUpdate(message, visible);
    this.hideLegacyInformationUI();
  }

  updateHUD() {
    this.missionText?.setText(`* MISI\n${this.currentMission}`);
    this.statusText?.setText(`* STATUS\n${this.currentStatus}`);
    this.scoreText?.setText(`* SKOR\nBintang: ${this.score}`);
    this.promptText?.setText(this.currentPrompt);
    this.promptText?.setVisible(Boolean(this.currentPrompt));
    this.emitObjectiveUpdate();
    this.emitStatusUpdate();
    this.emitPromptUpdate();
    this.hideLegacyInformationUI();
  }
}
