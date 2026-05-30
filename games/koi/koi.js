(() => {
  "use strict";

  const CONFIG = {
    dailyCredit: 50,
    bet: 3,
    creditMax: 9999,

    probs: {
      monthPair: 1 / 8,
      sameMonth: 1 / 16,
      ribbon: 1 / 36,
      sake: 1 / 132,
      reg: 1 / 260,
      big: 1 / 300
    },

    payout: {
      monthPair: 2,
      sameMonth: 8,
      redRibbon: 15,
      blueRibbon: 15,
      blossomSake: 60,
      moonSake: 60,
      boarDeerButterfly: 120,
      threeBrights: 240,
      miss: 0
    },

    sounds: {
      draw: "assets/se/draw.mp3",
      flip: "assets/se/flip.mp3",
      win: "assets/se/win.mp3",
      sanko: "assets/se/sanko.mp3",
      shiko: "assets/se/shiko.mp3",
      goko: "assets/se/goko.mp3"
    }
  };

  const STORAGE_KEY = "kashin_koikoi_final";

  const deck = [
    "01_h", "01_r", "01_k1", "01_k2",
    "02_t", "02_r", "02_k1", "02_k2",
    "03_h", "03_r", "03_k1", "03_k2",
    "04_t", "04_r", "04_k1", "04_k2",
    "05_t", "05_r", "05_k1", "05_k2",
    "06_t", "06_b", "06_k1", "06_k2",
    "07_t", "07_r", "07_k1", "07_k2",
    "08_h", "08_t", "08_k1", "08_k2",
    "09_t", "09_b", "09_k1", "09_k2",
    "10_t", "10_b", "10_k1", "10_k2",
    "11_h", "11_t", "11_r", "11_k1",
    "12_h", "12_k1", "12_k2", "12_k3"
  ];

  const resultMap = {
    monthPair: {
      label: "MONTH PAIR +2",
      payout: 2,
      cards: ["01_k1", "01_k2", "02_k1"]
    },

    sameMonth: {
      label: "THREE OF A MONTH +8",
      payout: 8,
      cards: ["03_h", "03_r", "03_k1"]
    },

    redRibbon: {
      label: "RED RIBBONS +15",
      payout: 15,
      cards: ["01_r", "02_r", "03_r"]
    },

    blueRibbon: {
      label: "BLUE RIBBONS +15",
      payout: 15,
      cards: ["06_b", "09_b", "10_b"]
    },

    blossomSake: {
      label: "SAKE WITH BLOSSOMS +60",
      payout: 60,
      cards: ["03_h", "09_t", "03_k1"],
      special: "sanko"
    },

    moonSake: {
      label: "SAKE WITH MOON +60",
      payout: 60,
      cards: ["08_h", "09_t", "08_k1"],
      special: "sanko"
    },

    boarDeerButterfly: {
      label: "BOAR DEER BUTTERFLY +120",
      payout: 120,
      cards: ["07_t", "10_t", "06_t"],
      special: "shiko"
    },

    threeBrights: {
      label: "THREE BRIGHTS +240",
      payout: 240,
      cards: ["01_h", "03_h", "08_h"],
      special: "goko"
    },

    miss: {
      label: "",
      payout: 0,
      cards: []
    }
  };

  const els = {
    credit: document.getElementById("credit"),
    payout: document.getElementById("payout"),
    totalGames: document.getElementById("totalGames"),
    message: document.getElementById("message"),
    drawBtn: document.getElementById("drawBtn"),

    cards: [
      document.getElementById("card0"),
      document.getElementById("card1"),
      document.getElementById("card2")
    ],

    soundToggle: document.getElementById("soundToggle"),

    resetBtn: document.getElementById("resetBtn"),
    resetModal: document.getElementById("resetModal"),
    resetYes: document.getElementById("resetYes"),
    resetNo: document.getElementById("resetNo"),

    roleBtn: document.getElementById("roleBtn"),
    roleModal: document.getElementById("roleModal"),
    roleClose: document.getElementById("roleClose")
  };

  const sound = {};

  for (const [key, src] of Object.entries(CONFIG.sounds)) {
    sound[key] = new Audio(src);
    sound[key].preload = "auto";
  }

  let state = loadState();
  let isDrawing = false;

  init();

  function init() {
    applyDailyCredit();
    renderAll();
    showBackCards();

    els.drawBtn.addEventListener("click", onDraw);

    els.soundToggle.addEventListener("click", toggleSound);

    els.resetBtn.addEventListener("click", () => {
      els.resetModal.classList.remove("hidden");
    });

    els.resetNo.addEventListener("click", () => {
      els.resetModal.classList.add("hidden");
    });

    els.resetYes.addEventListener("click", resetAll);

    els.roleBtn.addEventListener("click", () => {
      els.roleModal.classList.remove("hidden");
    });

    els.roleClose.addEventListener("click", () => {
      els.roleModal.classList.add("hidden");
    });
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
      lastPlayDate: "",
      soundOn: false
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

    isDrawing = false;

    els.resetModal.classList.add("hidden");
    els.message.textContent = "";

    showBackCards();
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

  function onDraw() {
    if (isDrawing) return;

    if (state.credit < CONFIG.bet) {
      els.message.textContent = "NO CREDIT";
      return;
    }

    isDrawing = true;
    els.drawBtn.disabled = true;

    clearCardEffects();

    state.credit -= CONFIG.bet;
    state.totalGames += 1;
    state.payout = 0;
    els.message.textContent = "";

    playSound("draw");

    const key = lottery();
    const result = resultMap[key];
    const cards = key === "miss" ? randomMissCards() : result.cards;

    showBackCards();

    cards.forEach((card, index) => {
      setTimeout(() => {
        els.cards[index].src = cardPath(card);
        playSound("flip");
      }, 220 + index * 260);
    });

    setTimeout(() => {
      finishDraw(result);
    }, 1120);
  }

  function finishDraw(result) {
    state.payout = result.payout;

    if (result.payout > 0) {
      state.credit = clampCredit(state.credit + result.payout);
      els.message.textContent = result.label;

      if (result.special === "sanko") {
        addSpecialEffect("special-sanko");
        playSound("sanko");
      } else if (result.special === "shiko") {
        addSpecialEffect("special-shiko");
        playSound("shiko");
      } else if (result.special === "goko") {
        addSpecialEffect("special-goko");
        playSound("goko");
      } else {
        addWinEffect();
        playSound("win");
      }
    } else {
      els.message.textContent = "";
    }

    isDrawing = false;
    els.drawBtn.disabled = state.credit < CONFIG.bet;

    renderAll();
    saveState();
  }

  function lottery() {
    if (Math.random() < CONFIG.probs.big) {
      return "threeBrights";
    }

    if (Math.random() < CONFIG.probs.reg) {
      return "boarDeerButterfly";
    }

    if (Math.random() < CONFIG.probs.sake) {
      return Math.random() < 0.5 ? "blossomSake" : "moonSake";
    }

    if (Math.random() < CONFIG.probs.ribbon) {
      return Math.random() < 0.5 ? "redRibbon" : "blueRibbon";
    }

    if (Math.random() < CONFIG.probs.sameMonth) {
      return "sameMonth";
    }

    if (Math.random() < CONFIG.probs.monthPair) {
      return "monthPair";
    }

    return "miss";
  }

  function showBackCards() {
    els.cards.forEach((img) => {
      img.src = "assets/back.png";

      img.closest(".card").classList.remove(
        "win",
        "special-sanko",
        "special-shiko",
        "special-goko"
      );
    });
  }

  function clearCardEffects() {
    els.cards.forEach((img) => {
      img.closest(".card").classList.remove(
        "win",
        "special-sanko",
        "special-shiko",
        "special-goko"
      );
    });
  }

  function addWinEffect() {
    els.cards.forEach((img) => {
      img.closest(".card").classList.add("win");
    });
  }

  function addSpecialEffect(className) {
    els.cards.forEach((img) => {
      const card = img.closest(".card");
      card.classList.add("win");
      card.classList.add(className);
    });
  }

  function randomMissCards() {
    for (let i = 0; i < 1000; i++) {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);

      if (checkYaku(selected) === "miss") {
        return selected;
      }
    }

    return ["01_k1", "02_k1", "03_k1"];
  }

  function checkYaku(cards) {
    const months = cards.map(monthOf);
    const types = cards.map(typeOf);

    if (containsAll(cards, ["01_r", "02_r", "03_r"])) return "redRibbon";
    if (containsAll(cards, ["06_b", "09_b", "10_b"])) return "blueRibbon";
    if (containsAll(cards, ["07_t", "10_t", "06_t"])) return "boarDeerButterfly";
    if (containsAll(cards, ["03_h", "09_t"])) return "blossomSake";
    if (containsAll(cards, ["08_h", "09_t"])) return "moonSake";

    const brightCount = types.filter((type) => type === "h").length;

    if (brightCount >= 3) {
      return "threeBrights";
    }

    if (months[0] === months[1] && months[1] === months[2]) {
      return "sameMonth";
    }

    if (
      months[0] === months[1] ||
      months[0] === months[2] ||
      months[1] === months[2]
    ) {
      return "monthPair";
    }

    return "miss";
  }

  function containsAll(cards, target) {
    return target.every((card) => cards.includes(card));
  }

  function monthOf(card) {
    return card.slice(0, 2);
  }

  function typeOf(card) {
    return card.split("_")[1].replace(/[0-9]/g, "");
  }

  function cardPath(id) {
    const month = id.slice(0, 2);
    return `assets/${month}/${id}.png`;
  }

  function renderAll() {
    els.credit.textContent = pad(state.credit, 4);
    els.payout.textContent = pad(state.payout, 3);
    els.totalGames.textContent = pad(state.totalGames, 4);

    els.drawBtn.disabled = isDrawing || state.credit < CONFIG.bet;

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
})();