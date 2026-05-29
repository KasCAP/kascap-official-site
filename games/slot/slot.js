(() => {
  "use strict";

  const CONFIG = {
    dailyCredit: 50,
    bet: 3,
    creditMax: 9999,
    spinLockMs: 700,

    probs: {
      big: 1 / 240,
      reg: 1 / 360,
      grape: 1 / 10,
      bell: 1 / 120,
      cherry: 1 / 60,
      replay: 1 / 8
    },

    payout: {
      big: 360,
      reg: 120,
      grape: 6,
      bell: 15,
      cherry: 2,
      replay: 0,
      miss: 0
    },

    assets: {
      lampOff: "assets/slot/cap_off.png",
      lampOn: "assets/slot/cap_on.png",

      symbols: {
        cherry: "assets/slot/cherry.png",
        grape: "assets/slot/grape.png",
        bell: "assets/slot/bell.png",
        replay: "assets/slot/replay.png",
        big: "assets/slot/big.png",
        reg: "assets/slot/reg.png",
        blank: "assets/slot/blank.png"
      },

      sounds: {
        bet: "assets/slot/sounds/bet.mp3",
        lever: "assets/slot/sounds/lever.mp3",
        stop: "assets/slot/sounds/stop.mp3",
        coin: "assets/slot/sounds/coin.mp3",
        replay: "assets/slot/sounds/replay.mp3",
        capLamp: "assets/slot/sounds/cap_lamp.mp3",
        bigBonus: "assets/slot/sounds/big_bonus.mp3",
        regBonus: "assets/slot/sounds/reg_bonus.mp3"
      }
    }
  };

  const STORAGE_KEY = "kascap_slot_final";

  const els = {
    credit: document.getElementById("credit"),
    payout: document.getElementById("payout"),
    totalGames: document.getElementById("totalGames"),
    bigCount: document.getElementById("bigCount"),
    regCount: document.getElementById("regCount"),
    leftLamp: document.getElementById("leftLamp"),
    rightLamp: document.getElementById("rightLamp"),
    message: document.getElementById("message"),
    lever: document.getElementById("leverBtn"),
    stopBtns: Array.from(document.querySelectorAll(".stop-btn")),
    reels: [
      document.getElementById("reel0"),
      document.getElementById("reel1"),
      document.getElementById("reel2")
    ],
    soundToggle: document.getElementById("soundToggle"),
    resetBtn: document.getElementById("resetBtn"),
    resetModal: document.getElementById("resetModal"),
    resetYes: document.getElementById("resetYes"),
    resetNo: document.getElementById("resetNo")
  };

  const sound = {};

  for (const [key, src] of Object.entries(CONFIG.assets.sounds)) {
    sound[key] = new Audio(src);
    sound[key].preload = "auto";
  }

  let state = loadState();
  let currentSpin = null;
  let spinningTimer = null;
  let stoppedCount = 0;
  let stopped = [false, false, false];

  init();

  function init() {
    applyDailyCredit();
    renderAll();
    setBonusLamps(false);
    drawIdleReels();

    els.lever.addEventListener("click", onLever);

    els.stopBtns.forEach((btn) => {
      btn.addEventListener("click", () => stopReel(Number(btn.dataset.reel)));
    });

    els.soundToggle.addEventListener("click", toggleSound);
    els.resetBtn.addEventListener("click", () => {
      els.resetModal.classList.remove("hidden");
    });
    els.resetNo.addEventListener("click", () => {
      els.resetModal.classList.add("hidden");
    });
    els.resetYes.addEventListener("click", resetAll);
  }

  function getJstDateKey() {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      credit: 0,
      payout: 0,
      totalGames: 0,
      bigCount: 0,
      regCount: 0,
      gamesSinceBonus: 0,
      lastPlayDate: "",
      soundOn: false,
      replayFree: false
    };
  }

  function loadState() {
    try {
      return {
        ...defaultState(),
        ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applyDailyCredit() {
    const today = getJstDateKey();

    if (state.lastPlayDate !== today) {
      state.credit = clampCredit(state.credit + CONFIG.dailyCredit);
      state.lastPlayDate = today;
      saveState();
    }
  }

  function resetAll() {
    stopAllSounds();

    state = defaultState();
    applyDailyCredit();

    currentSpin = null;
    stoppedCount = 0;
    stopped = [false, false, false];

    clearInterval(spinningTimer);

    els.resetModal.classList.add("hidden");

    setBonusLamps(false);
    els.message.textContent = "";

    drawIdleReels();
    renderAll();
    saveState();
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;

    if (!state.soundOn) {
      stopAllSounds();
    }

    renderSound();
    saveState();
  }

  function onLever() {
    if (currentSpin) return;

    const isReplay = state.replayFree;

    if (!isReplay && state.credit < CONFIG.bet) {
      els.message.textContent = "NO CREDIT";
      return;
    }

    setBonusLamps(false);
    els.message.textContent = "";
    state.payout = 0;

    if (isReplay) {
      state.replayFree = false;
    } else {
      state.credit -= CONFIG.bet;
      playSound("bet");
    }

    state.totalGames += 1;
    state.gamesSinceBonus += 1;

    playSound("lever");

    const result = lottery();
    currentSpin = makeSpin(result);

    if (result === "big" || result === "reg") {
      setBonusLamps(true);
    }

    stopped = [false, false, false];
    stoppedCount = 0;

    els.lever.disabled = true;

    startReelAnimation();

    setTimeout(() => {
      els.stopBtns.forEach((btn) => {
        btn.disabled = false;
      });
    }, CONFIG.spinLockMs);

    renderAll();
    saveState();
  }

  function lottery() {
    if (Math.random() < CONFIG.probs.big) return "big";
    if (Math.random() < CONFIG.probs.reg) return "reg";

    const r = Math.random();
    let acc = 0;

    acc += CONFIG.probs.grape;
    if (r < acc) return "grape";

    acc += CONFIG.probs.bell;
    if (r < acc) return "bell";

    acc += CONFIG.probs.cherry;
    if (r < acc) return "cherry";

    acc += CONFIG.probs.replay;
    if (r < acc) return "replay";

    return "miss";
  }

  function makeSpin(result) {
    const center = {
      big: ["big", "big", "big"],
      reg: ["reg", "reg", "reg"],
      grape: ["grape", "grape", "grape"],
      bell: ["bell", "bell", "bell"],
      cherry: ["cherry", "blank", "blank"],
      replay: ["replay", "replay", "replay"],
      miss: randomMissLine()
    }[result];

    return {
      result,
      finalGrid: [
        [randomSymbol(), center[0], randomSymbol()],
        [randomSymbol(), center[1], randomSymbol()],
        [randomSymbol(), center[2], randomSymbol()]
      ]
    };
  }

  function randomMissLine() {
    const symbols = ["cherry", "grape", "bell", "replay", "big", "reg", "blank"];
    let line;

    do {
      line = [
        randomFrom(symbols),
        randomFrom(symbols),
        randomFrom(symbols)
      ];
    } while (
      (line[0] === line[1] && line[1] === line[2]) ||
      line[0] === "cherry"
    );

    return line;
  }

  function randomSymbol() {
    return randomFrom([
      "cherry",
      "grape",
      "bell",
      "replay",
      "big",
      "reg",
      "blank"
    ]);
  }

  function startReelAnimation() {
    els.reels.forEach((reel) => {
      reel.classList.add("spinning");
    });

    spinningTimer = setInterval(() => {
      els.reels.forEach((reel, i) => {
        if (!stopped[i]) {
          drawReel(i, [
            randomSymbol(),
            randomSymbol(),
            randomSymbol()
          ]);
        }
      });
    }, 90);
  }

  function stopReel(index) {
    if (!currentSpin || stopped[index]) return;
    if (els.stopBtns[index].disabled) return;

    stopped[index] = true;
    stoppedCount += 1;

    els.stopBtns[index].disabled = true;
    els.reels[index].classList.remove("spinning");

    drawReel(index, currentSpin.finalGrid[index]);

    playSound("stop");

    if (stoppedCount === 3) {
      finishSpin();
    }
  }

  function finishSpin() {
    clearInterval(spinningTimer);

    const result = currentSpin.result;
    const pay = CONFIG.payout[result] || 0;

    state.payout = pay;

    if (pay > 0) {
      state.credit = clampCredit(state.credit + pay);
    }

    if (result === "big") {
      state.bigCount += 1;
      state.gamesSinceBonus = 0;

      els.message.textContent = "BIG BONUS";
      setBonusLamps(false);
      playSound("bigBonus");

    } else if (result === "reg") {
      state.regCount += 1;
      state.gamesSinceBonus = 0;

      els.message.textContent = "REG BONUS";
      setBonusLamps(false);
      playSound("regBonus");

    } else if (result === "replay") {
      state.replayFree = true;
      els.message.textContent = "REPLAY";
      playSound("replay");

    } else if (pay > 0) {
      els.message.textContent = `${result.toUpperCase()} +${pay}`;
      playSound("coin");

    } else {
      els.message.textContent = "";
    }

    currentSpin = null;
    els.lever.disabled = false;

    renderAll();
    saveState();
  }

  function setBonusLamps(on) {
    [els.leftLamp, els.rightLamp].forEach((lamp) => {
      lamp.src = on ? CONFIG.assets.lampOn : CONFIG.assets.lampOff;
      lamp.classList.toggle("blink", on);
    });
  }

  function drawIdleReels() {
    const lines = [
      ["cherry", "grape", "bell"],
      ["replay", "big", "reg"],
      ["grape", "bell", "cherry"]
    ];

    lines.forEach((line, i) => {
      drawReel(i, line);
    });
  }

  function drawReel(index, symbols) {
    els.reels[index].innerHTML = symbols
      .map((name) => {
        const src = CONFIG.assets.symbols[name] || CONFIG.assets.symbols.blank;
        return `<div class="symbol-cell"><img src="${src}" alt="${name}"></div>`;
      })
      .join("");
  }

  function renderAll() {
    els.credit.textContent = pad(state.credit, 4);
    els.payout.textContent = pad(state.payout, 3);
    els.totalGames.textContent = pad(state.totalGames, 4);
    els.bigCount.textContent = pad(state.bigCount, 2);
    els.regCount.textContent = pad(state.regCount, 2);

    renderSound();
  }

  function renderSound() {
    els.soundToggle.setAttribute("aria-pressed", String(state.soundOn));
  }

  function playSound(key) {
    if (!state.soundOn || !sound[key]) return;

    try {
      sound[key].currentTime = 0;
      sound[key].play().catch(() => {});
    } catch {}
  }

  function stopAllSounds() {
    Object.values(sound).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function clampCredit(value) {
    return Math.min(CONFIG.creditMax, Math.max(0, value));
  }

  function pad(num, len) {
    return String(num).padStart(len, "0");
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
})();