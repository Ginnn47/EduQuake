import Phaser from "phaser";
import { ASSETS } from "../assetManifest";

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 760;
const PLAYER_SPEED = 140;
const PLAYER_FRAME_SIZE = 256;
const PLAYER_DISPLAY_SIZE = 40;
const PLAYER_BODY = {
  width: 140,
  height: 176,
  offsetX: 58,
  offsetY: 72,
};
const ROOM = {
  x: 80,
  y: 104,
  width: 1120,
  height: 560,
};
const PLAYER_SPAWN = {
  x: 250,
  y: 560,
};

const STATES = {
  INTRO: "INTRO",
  QUAKE: "QUAKE",
  FIND_DESK: "FIND_DESK",
  HIDDEN: "HIDDEN",
  EVACUATE: "EVACUATE",
  COMPLETE: "COMPLETE",
};

const DIRECTIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
};

const OBJECT_ASSETS = [
  ["floorTile", "floorTile"],
  ["wallTile", "wallTile"],
  ["chalkboard", "chalkboard"],
  ["window", "window"],
  ["door", "door"],
  ["desk", "desk"],
  ["chair", "chair"],
  ["teacherDesk", "teacherDesk"],
  ["cabinet", "cabinet"],
  ["bookshelf", "bookshelf"],
  ["poster", "poster"],
  ["plant", "plant"],
  ["trashBin", "trashBin"],
  ["debris", "debris"],
  ["crack", "crack"],
  ["warningIcon", "warningIcon"],
  ["safeMarker", "safeMarker"],
  ["exitMarker", "exitMarker"],
];

export default class ClassroomScene extends Phaser.Scene {
  constructor() {
    super("ClassroomScene");

    this.player = null;
    this.cursors = null;
    this.keys = null;
    this.colliders = null;
    this.deskObjects = null;
    this.safeZones = null;
    this.hazardZones = null;
    this.doorExitZone = null;
    this.doorVisual = null;
    this.safeMarker = null;
    this.exitMarker = null;
    this.promptText = null;
    this.warningMarkers = [];
    this.quakeSound = null;
    this.missionPanel = null;
    this.statusPanel = null;
    this.dialogPanel = null;
    this.completePanel = null;
    this.missionText = null;
    this.statusText = null;
    this.scoreText = null;
    this.controlText = null;
    this.dialogText = null;
    this.pauseText = null;
    this.lastDirection = DIRECTIONS.DOWN;
    this.score = 100;
    this.gameState = STATES.INTRO;
    this.isPaused = false;
    this.lastPenaltyTime = 0;
    this.resultSubmitted = false;
    this.nearestSafeZone = null;
    this.keyState = {
      left: false,
      right: false,
      up: false,
      down: false,
      actionQueued: false,
      escapeQueued: false,
    };
    this.boundKeyDown = null;
    this.boundKeyUp = null;
    this.boundBlur = null;
  }

  preload() {
    OBJECT_ASSETS.forEach(([textureKey, manifestKey]) => {
      this.load.image(textureKey, ASSETS.objects[manifestKey]);
    });

    this.load.spritesheet("player", ASSETS.sprites.player, {
      frameWidth: PLAYER_FRAME_SIZE,
      frameHeight: PLAYER_FRAME_SIZE,
    });

    if (ASSETS.audio.quake) {
      this.load.audio("quake", ASSETS.audio.quake);
    }
  }

  create() {
    this.resetRunState();
    this.focusCanvas();
    this.createWorld();
    this.createPlayer();
    this.createAnimations();
    this.createControls();
    this.createUI();
    this.setupCamera();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.removeWindowKeyboardListeners());

    if (this.cache.audio.exists("quake")) {
      this.quakeSound = this.sound.add("quake", { loop: true, volume: 0.42 });
    }

    this.setGameState(STATES.INTRO);
    this.time.delayedCall(2000, () => {
      if (this.gameState === STATES.INTRO) {
        this.setGameState(STATES.QUAKE);
      }
    });
  }

  update() {
    if ((this.keys?.ESC && Phaser.Input.Keyboard.JustDown(this.keys.ESC)) || this.consumeEscapeInput()) {
      this.togglePause();
    }

    if (!this.player || this.gameState === STATES.COMPLETE || this.isPaused) {
      this.player?.setVelocity(0);
      return;
    }

    this.handlePlayerMovement();
    this.updateMissionTriggers();
  }

  resetRunState() {
    this.lastDirection = DIRECTIONS.DOWN;
    this.score = 100;
    this.gameState = STATES.INTRO;
    this.isPaused = false;
    this.lastPenaltyTime = 0;
    this.resultSubmitted = false;
    this.warningMarkers = [];
    this.nearestSafeZone = null;
  }

  focusCanvas() {
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.style.outline = "none";
    this.game.canvas.focus();
    this.input.on("pointerdown", () => {
      this.game.canvas.focus();
    });
  }

  createWorld() {
    this.physics.world.setBounds(ROOM.x, ROOM.y, ROOM.width, ROOM.height);
    this.colliders = this.physics.add.staticGroup();
    this.deskObjects = this.physics.add.staticGroup();
    this.safeZones = this.physics.add.staticGroup();
    this.hazardZones = this.physics.add.staticGroup();

    this.add.tileSprite(ROOM.x + ROOM.width / 2, ROOM.y + ROOM.height / 2, ROOM.width, ROOM.height, "floorTile").setDepth(0);
    this.add.tileSprite(ROOM.x + ROOM.width / 2, ROOM.y - 52, ROOM.width, 126, "wallTile").setDepth(1);
    this.add.tileSprite(ROOM.x + ROOM.width / 2, ROOM.y + ROOM.height + 46, ROOM.width, 92, "wallTile").setDepth(1);
    this.add.tileSprite(ROOM.x - 42, ROOM.y + ROOM.height / 2, 84, ROOM.height, "wallTile").setDepth(1);
    this.add.tileSprite(ROOM.x + ROOM.width + 42, ROOM.y + ROOM.height / 2, 84, ROOM.height, "wallTile").setDepth(1);

    this.add.image(640, 122, "chalkboard").setScale(2.25).setDepth(3);
    this.add.image(365, 142, "poster").setScale(1.25).setDepth(3);
    this.add.image(870, 142, "poster").setScale(1.18).setDepth(3);

    this.createHazardObject(210, 156, "window", 1.9, {
      zoneWidth: 150,
      zoneHeight: 120,
      markerOffsetY: -74,
    });
    this.createHazardObject(1060, 330, "cabinet", 1.52, {
      zoneWidth: 138,
      zoneHeight: 152,
      markerOffsetY: -86,
      collides: true,
      bodyWidth: 78,
      bodyHeight: 112,
    });

    this.createColliderObject(640, 210, "teacherDesk", 1.65, {
      bodyWidth: 128,
      bodyHeight: 62,
      depth: 5,
    });
    this.createColliderObject(1038, 518, "bookshelf", 1.35, {
      bodyWidth: 92,
      bodyHeight: 96,
      depth: 5,
    });

    this.createDeskCluster(430, 330);
    this.createDeskCluster(620, 330);
    this.createDeskCluster(810, 330);
    this.createDeskCluster(430, 500);
    this.createDeskCluster(620, 500);
    this.createDeskCluster(810, 500);

    this.add.image(170, 540, "plant").setScale(1.35).setDepth(4);
    this.add.image(1122, 548, "trashBin").setScale(1.28).setDepth(4);
    this.add.image(915, 582, "crack").setScale(1.22).setDepth(4);
    this.add.image(925, 410, "debris").setScale(1.25).setDepth(4);

    this.doorVisual = this.add.image(1154, 586, "door").setScale(1.65).setDepth(3).setAlpha(0.48);
    this.doorExitZone = this.add.zone(1154, 586, 96, 112);
    this.physics.add.existing(this.doorExitZone, true);

    this.safeMarker = this.add.image(0, 0, "safeMarker").setScale(0.86).setDepth(14).setVisible(false);
    this.exitMarker = this.add.image(1154, 500, "exitMarker").setScale(0.62).setDepth(14).setVisible(false);
  }

  createDeskCluster(x, y) {
    const chair = this.add.image(x, y + 48, "chair").setScale(1.2).setDepth(4);
    const desk = this.createColliderObject(x, y, "desk", 1.55, {
      bodyWidth: 60,
      bodyHeight: 52,
      depth: 6,
    });
    this.deskObjects.add(desk);

    const safeZone = this.add.zone(x, y + 36, 112, 118);
    this.physics.add.existing(safeZone, true);
    safeZone.desk = desk;
    safeZone.chair = chair;
    this.safeZones.add(safeZone);
  }

  createColliderObject(x, y, texture, scale, options = {}) {
    const object = this.physics.add.staticImage(x, y, texture).setScale(scale).setDepth(options.depth ?? 5);
    object.body.setSize(options.bodyWidth ?? object.width * 0.68, options.bodyHeight ?? object.height * 0.58);
    object.body.setOffset(
      (object.width - object.body.width) / 2,
      (object.height - object.body.height) / 2 + object.height * 0.12,
    );
    object.refreshBody();
    this.colliders.add(object);
    return object;
  }

  createHazardObject(x, y, texture, scale, options = {}) {
    const visual = options.collides
      ? this.createColliderObject(x, y, texture, scale, {
          bodyWidth: options.bodyWidth,
          bodyHeight: options.bodyHeight,
          depth: 5,
        })
      : this.add.image(x, y, texture).setScale(scale).setDepth(4);

    const zone = this.add.zone(x, y, options.zoneWidth ?? visual.displayWidth, options.zoneHeight ?? visual.displayHeight);
    this.physics.add.existing(zone, true);
    this.hazardZones.add(zone);

    const warning = this.add
      .image(x, y + (options.markerOffsetY ?? -visual.displayHeight / 2 - 20), "warningIcon")
      .setScale(0.9)
      .setDepth(14)
      .setVisible(false);
    this.warningMarkers.push(warning);

    return visual;
  }

  createPlayer() {
    this.player = this.physics.add.sprite(PLAYER_SPAWN.x, PLAYER_SPAWN.y, "player").setDepth(12);
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(PLAYER_DISPLAY_SIZE, PLAYER_DISPLAY_SIZE);
    this.player.body.setSize(PLAYER_BODY.width, PLAYER_BODY.height);
    this.player.body.setOffset(PLAYER_BODY.offsetX, PLAYER_BODY.offsetY);
    this.player.setFrame(0);
    this.physics.add.collider(this.player, this.colliders);
  }

  createAnimations() {
    const frameRate = 8;
    const animations = [
      ["walk_down", 0, 3],
      ["walk_left", 4, 7],
      ["walk_right", 8, 11],
      ["walk_up", 12, 15],
    ];

    animations.forEach(([key, start, end]) => {
      if (this.anims.exists(key)) {
        return;
      }
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("player", { start, end }),
        frameRate,
        repeat: -1,
      });
    });
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.E,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.ESC,
    ]);
    this.installWindowKeyboardListeners();
  }

  installWindowKeyboardListeners() {
    this.removeWindowKeyboardListeners();

    const updateKey = (event, pressed) => {
      const key = event.key.toLowerCase();
      const code = event.code;
      const controls = ["arrowleft", "arrowright", "arrowup", "arrowdown", " ", "spacebar", "w", "a", "s", "d", "e"];
      const codes = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyE"];

      if (key === "arrowleft" || key === "a" || code === "ArrowLeft" || code === "KeyA") {
        this.keyState.left = pressed;
      }
      if (key === "arrowright" || key === "d" || code === "ArrowRight" || code === "KeyD") {
        this.keyState.right = pressed;
      }
      if (key === "arrowup" || key === "w" || code === "ArrowUp" || code === "KeyW") {
        this.keyState.up = pressed;
      }
      if (key === "arrowdown" || key === "s" || code === "ArrowDown" || code === "KeyS") {
        this.keyState.down = pressed;
      }
      if (pressed && (key === "e" || key === " " || key === "spacebar" || code === "KeyE" || code === "Space")) {
        this.keyState.actionQueued = true;
      }
      if (pressed && (key === "escape" || code === "Escape")) {
        this.keyState.escapeQueued = true;
      }
      if (controls.includes(key) || codes.includes(code)) {
        event.preventDefault();
      }
    };

    this.boundKeyDown = (event) => updateKey(event, true);
    this.boundKeyUp = (event) => updateKey(event, false);
    this.boundBlur = () => this.clearHeldKeys();
    window.addEventListener("keydown", this.boundKeyDown, { capture: true, passive: false });
    window.addEventListener("keyup", this.boundKeyUp, { capture: true, passive: false });
    document.addEventListener("keydown", this.boundKeyDown, { capture: true, passive: false });
    document.addEventListener("keyup", this.boundKeyUp, { capture: true, passive: false });
    window.addEventListener("blur", this.boundBlur);
  }

  removeWindowKeyboardListeners() {
    if (this.boundKeyDown) {
      window.removeEventListener("keydown", this.boundKeyDown, { capture: true });
      document.removeEventListener("keydown", this.boundKeyDown, { capture: true });
    }
    if (this.boundKeyUp) {
      window.removeEventListener("keyup", this.boundKeyUp, { capture: true });
      document.removeEventListener("keyup", this.boundKeyUp, { capture: true });
    }
    if (this.boundBlur) {
      window.removeEventListener("blur", this.boundBlur);
    }
    this.boundKeyDown = null;
    this.boundKeyUp = null;
    this.boundBlur = null;
  }

  clearHeldKeys() {
    this.keyState.left = false;
    this.keyState.right = false;
    this.keyState.up = false;
    this.keyState.down = false;
  }

  setExternalControl(direction, pressed) {
    if (["left", "right", "up", "down"].includes(direction)) {
      this.keyState[direction] = pressed;
    }
  }

  queueExternalAction() {
    this.keyState.actionQueued = true;
  }

  queueExternalEscape() {
    this.keyState.escapeQueued = true;
  }

  createUI() {
    this.missionPanel = this.add.rectangle(0, 0, 760, 54, 0x17110b, 0.92).setScrollFactor(0).setDepth(40);
    this.missionPanel.setStrokeStyle(2, 0xd9a441);
    this.statusPanel = this.add.rectangle(0, 0, 760, 32, 0x2b1b0d, 0.9).setScrollFactor(0).setDepth(40);

    this.missionText = this.add.text(0, 0, "", {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#f4df9d",
      wordWrap: { width: 660 },
    }).setScrollFactor(0).setDepth(42);

    this.statusText = this.add.text(0, 0, "Status: Normal", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#f4df9d",
    }).setScrollFactor(0).setDepth(42);

    this.scoreText = this.add.text(0, 0, "Skor: 100", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#f4df9d",
    }).setScrollFactor(0).setDepth(42);

    this.controlText = this.add.text(0, 0, "WASD / Arrow: gerak    E / Space: interaksi    Esc: pause", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#f4df9d",
      backgroundColor: "rgba(23, 17, 11, 0.78)",
      padding: { x: 9, y: 5 },
    }).setScrollFactor(0).setDepth(42);

    this.dialogPanel = this.add.rectangle(0, 0, 720, 74, 0x17110b, 0.94).setScrollFactor(0).setDepth(43);
    this.dialogPanel.setStrokeStyle(2, 0xf4df9d);
    this.dialogText = this.add.text(0, 0, "", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ffffff",
      wordWrap: { width: 650 },
    }).setScrollFactor(0).setDepth(44);

    this.pauseText = this.add.text(0, 0, "PAUSED", {
      fontFamily: "monospace",
      fontSize: "30px",
      color: "#f4df9d",
      backgroundColor: "rgba(23, 17, 11, 0.94)",
      padding: { x: 22, y: 14 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60).setVisible(false);

    this.promptText = this.add.text(0, 0, "Tekan E / Space", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#1a1108",
      backgroundColor: "rgba(247, 230, 176, 0.94)",
      padding: { x: 7, y: 4 },
    }).setOrigin(0.5).setDepth(18).setVisible(false);

    this.scale.on("resize", this.layoutUI, this);
    this.layoutUI();
  }

  layoutUI() {
    const width = this.scale.width;
    const height = this.scale.height;
    const panelWidth = Math.min(width - 36, 900);
    const dialogWidth = Math.min(width - 44, 760);

    this.missionPanel.setPosition(width / 2, 32).setSize(panelWidth, 54);
    this.statusPanel.setPosition(width / 2, 78).setSize(panelWidth, 32);
    this.missionText.setPosition((width - panelWidth) / 2 + 18, 15);
    this.missionText.setWordWrapWidth(panelWidth - 220);
    this.statusText.setPosition((width - panelWidth) / 2 + 18, 70);
    this.scoreText.setPosition((width + panelWidth) / 2 - 134, 70);
    this.controlText.setPosition(Math.max(18, width / 2 - 280), height - 32);
    this.dialogPanel.setPosition(width / 2, height - 86).setSize(dialogWidth, 74);
    this.dialogText.setPosition((width - dialogWidth) / 2 + 22, height - 110);
    this.dialogText.setWordWrapWidth(dialogWidth - 44);
    this.pauseText.setPosition(width / 2, height / 2);
  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.updateCameraZoom();
    this.cameras.main.centerOn(ROOM.x + ROOM.width / 2, ROOM.y + ROOM.height / 2);
    this.cameras.main.startFollow(this.player, true, 0.16, 0.16);
    this.cameras.main.setDeadzone(80, 56);
    this.scale.on("resize", this.updateCameraZoom, this);
  }

  updateCameraZoom() {
    const zoomByWidth = this.scale.width / 820;
    const zoomByHeight = this.scale.height / 500;
    const zoom = Phaser.Math.Clamp(Math.min(zoomByWidth, zoomByHeight), 1.35, 1.85);
    this.cameras.main.setZoom(zoom);
  }

  handlePlayerMovement() {
    const left = this.cursors.left.isDown || this.keys.A.isDown || this.keyState.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.keyState.right;
    const up = this.cursors.up.isDown || this.keys.W.isDown || this.keyState.up;
    const down = this.cursors.down.isDown || this.keys.S.isDown || this.keyState.down;
    const speed = this.gameState === STATES.HIDDEN ? 0 : PLAYER_SPEED;
    let input = "idle";

    this.player.setVelocity(0);

    if (left) {
      this.player.setVelocityX(-speed);
      input = DIRECTIONS.LEFT;
    } else if (right) {
      this.player.setVelocityX(speed);
      input = DIRECTIONS.RIGHT;
    }

    if (up) {
      this.player.setVelocityY(-speed);
      input = DIRECTIONS.UP;
    } else if (down) {
      this.player.setVelocityY(speed);
      input = DIRECTIONS.DOWN;
    }

    if (this.player.body.velocity.length() > 0) {
      this.player.body.velocity.normalize().scale(speed);
      this.lastDirection = input;
    }

    this.updatePlayerAnimation(input);
  }

  updatePlayerAnimation(input) {
    if (input === "idle" || this.gameState === STATES.HIDDEN) {
      this.player.anims.stop();
      this.player.setFrame(this.getIdleFrame());
      return;
    }

    this.player.anims.play(`walk_${this.lastDirection}`, true);
  }

  getIdleFrame() {
    if (this.lastDirection === DIRECTIONS.LEFT) {
      return 4;
    }
    if (this.lastDirection === DIRECTIONS.RIGHT) {
      return 8;
    }
    if (this.lastDirection === DIRECTIONS.UP) {
      return 12;
    }
    return 0;
  }

  consumeActionInput() {
    const phaserPressed = this.keys && (Phaser.Input.Keyboard.JustDown(this.keys.E) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE));
    const queued = this.keyState.actionQueued;
    this.keyState.actionQueued = false;
    return Boolean(phaserPressed || queued);
  }

  consumeEscapeInput() {
    const queued = this.keyState.escapeQueued;
    this.keyState.escapeQueued = false;
    return queued;
  }

  updateMissionTriggers() {
    if (this.gameState === STATES.QUAKE || this.gameState === STATES.FIND_DESK) {
      this.updateHazardFeedback();
    }

    if (this.gameState === STATES.FIND_DESK) {
      this.updateDeskPrompt();
      this.handleShelterInteraction();
    }

    if (this.gameState === STATES.EVACUATE) {
      this.promptText.setVisible(false);
      this.safeMarker.setVisible(false);
      this.checkDoorTouch();
    }
  }

  updateHazardFeedback() {
    const nearHazard = this.getNearestFromGroup(this.hazardZones, 110);
    if (!nearHazard) {
      this.setStatus(this.gameState === STATES.FIND_DESK ? "Cari meja aman" : "Gempa aktif", "#f4df9d");
      return;
    }

    this.setStatus("Bahaya!", "#ffb347");
    if (this.time.now - this.lastPenaltyTime > 900) {
      this.score = Math.max(0, this.score - 5);
      this.scoreText.setText(`Skor: ${this.score}`);
      this.lastPenaltyTime = this.time.now;
    }
  }

  updateDeskPrompt() {
    const nearestSafeZone = this.getNearestFromGroup(this.safeZones, 72);
    this.nearestSafeZone = nearestSafeZone;

    if (!nearestSafeZone) {
      this.promptText.setVisible(false);
      this.safeMarker.setVisible(false);
      return;
    }

    this.safeMarker.setPosition(nearestSafeZone.desk.x, nearestSafeZone.desk.y - 45).setVisible(true);
    this.promptText.setPosition(this.player.x, this.player.y - 34).setVisible(true);
    this.setStatus("Tekan E / Space untuk berlindung", "#f4df9d");
  }

  handleShelterInteraction() {
    if (!this.consumeActionInput() || !this.nearestSafeZone) {
      return;
    }

    this.setGameState(STATES.HIDDEN);
  }

  getNearestFromGroup(group, maxDistance) {
    let nearest = null;
    let nearestDistance = maxDistance;

    group.children.iterate((child) => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, child.x, child.y);
      if (distance <= nearestDistance) {
        nearest = child;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  setGameState(nextState) {
    this.gameState = nextState;

    if (nextState === STATES.INTRO) {
      this.setMission("Tunggu instruksi guru.");
      this.setStatus("Normal", "#f4df9d");
      this.setDialog("Guru: Anak-anak, tetap tenang dan ikuti instruksi.");
      return;
    }

    if (nextState === STATES.QUAKE) {
      this.setMission("GEMPA! Jauhi jendela dan lemari!");
      this.setStatus("Gempa aktif", "#ffdf6e");
      this.setDialog("");
      this.warningMarkers.forEach((marker) => marker.setVisible(true));
      this.quakeSound?.play();
      this.cameras.main.shake(900, 0.01);
      this.time.delayedCall(1000, () => {
        if (this.gameState === STATES.QUAKE) {
          this.setGameState(STATES.FIND_DESK);
        }
      });
      this.time.addEvent({
        delay: 520,
        repeat: 12,
        callback: () => {
          if (this.gameState === STATES.QUAKE || this.gameState === STATES.FIND_DESK) {
            this.cameras.main.shake(360, 0.006);
          }
        },
      });
      return;
    }

    if (nextState === STATES.FIND_DESK) {
      this.setMission("Cari meja terdekat lalu tekan E / Space untuk berlindung.");
      this.setStatus("Cari meja aman", "#f4df9d");
      return;
    }

    if (nextState === STATES.HIDDEN) {
      this.player.setVelocity(0);
      this.player.anims.stop();
      this.player.setFrame(this.getIdleFrame());
      this.player.setTint(0x99ff99);
      this.promptText.setVisible(false);
      this.safeMarker.setVisible(false);
      this.setMission("Bagus! Kamu sudah berlindung. Tunggu gempa reda.");
      this.setStatus("Berlindung", "#b7f7b0");
      this.setDialog("Guru: Tetap di bawah meja sampai guncangan berhenti.");
      this.score = Math.min(100, this.score + 8);
      this.scoreText.setText(`Skor: ${this.score}`);
      this.time.delayedCall(1500, () => {
        if (this.gameState === STATES.HIDDEN) {
          this.setGameState(STATES.EVACUATE);
        }
      });
      return;
    }

    if (nextState === STATES.EVACUATE) {
      this.player.clearTint();
      this.quakeSound?.stop();
      this.warningMarkers.forEach((marker) => marker.setVisible(false));
      this.doorVisual.setAlpha(1);
      this.exitMarker.setVisible(true);
      this.setMission("Gempa reda. Ikuti jalur evakuasi menuju pintu.");
      this.setStatus("Evakuasi", "#b7f7b0");
      this.setDialog("Guru: Jalan pelan, jangan berlari, menuju pintu evakuasi.");
      return;
    }

    if (nextState === STATES.COMPLETE) {
      this.player.setVelocity(0);
      this.player.anims.stop();
      this.quakeSound?.stop();
      this.promptText.setVisible(false);
      this.safeMarker.setVisible(false);
      this.exitMarker.setVisible(false);
      this.setMission("Simulasi selesai!");
      this.setStatus("Selesai", "#f4df9d");
      this.setDialog("");
      this.showCompletePanel();
      this.submitResult();
    }
  }

  checkDoorTouch() {
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.doorExitZone.getBounds())) {
      this.setGameState(STATES.COMPLETE);
    }
  }

  showCompletePanel() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.completePanel = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(70);
    this.completePanel.add(this.add.rectangle(0, 0, 520, 198, 0x17110b, 0.95).setStrokeStyle(3, 0xd9a441));
    this.completePanel.add(this.add.text(-176, -68, "MISSION COMPLETE", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#f4df9d",
    }));
    this.completePanel.add(this.add.text(-126, -18, "Simulasi selesai!", {
      fontFamily: "monospace",
      fontSize: "17px",
      color: "#ffffff",
    }));
    this.completePanel.add(this.add.text(-126, 22, `Skor akhir: ${this.score}`, {
      fontFamily: "monospace",
      fontSize: "17px",
      color: "#ffffff",
    }));
    this.completePanel.add(this.add.text(-126, 58, "Reward: Paspor", {
      fontFamily: "monospace",
      fontSize: "17px",
      color: "#b7f7b0",
    }));
  }

  togglePause() {
    if (this.gameState === STATES.COMPLETE) {
      return;
    }

    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);
    this.player.setVelocity(0);

    if (this.isPaused) {
      this.quakeSound?.pause();
    } else if ((this.gameState === STATES.QUAKE || this.gameState === STATES.FIND_DESK) && this.quakeSound && !this.quakeSound.isPlaying) {
      this.quakeSound.resume();
    }
  }

  async submitResult() {
    if (this.resultSubmitted) {
      return;
    }

    this.resultSubmitted = true;

    try {
      await fetch("/api/simulation-results/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scene: "classroom",
          score: this.score,
          completed: true,
          reward: "paspor",
          badge: "classroom_safe",
        }),
      });
    } catch (error) {
      console.warn("Django endpoint belum tersedia, game tetap selesai.", error);
    }
  }

  setMission(text) {
    this.missionText?.setText(`Misi: ${text}`);
  }

  setStatus(status, color) {
    this.statusText?.setText(`Status: ${status}`);
    this.statusText?.setColor(color);
  }

  setDialog(text) {
    const visible = Boolean(text);
    this.dialogPanel?.setVisible(visible);
    this.dialogText?.setVisible(visible);
    this.dialogText?.setText(text);
  }
}
