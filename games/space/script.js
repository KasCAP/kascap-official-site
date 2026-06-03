(() => {
  "use strict";

  const CONFIG = {
    dailyCredit: 10,

    canvasW: 740,
    canvasH: 520,

    groundY: 405,

    playerW: 74,
    playerH: 88,
    playerDownH: 48,

    blockSize: 64,
    coinSize: 48,
    dkSize: 48,

    gravity: 0.74,
    jumpPower: -18.2,

    baseSpeed: 4.4,
    maxSpeed: 8.2,
    speedUpEvery: 600,
    bgSpeedRate: 0.55,

    coinBonus: 100,
    dkDurationMs: 7200,

    coinRate: 0.72,
    dkRate: 0.11,

    obstacleGapMin: 270,
    obstacleGapMax: 470,
    itemGapMin: 300,
    itemGapMax: 620,

    obstacleSkin2Score: 800,
    obstacleSkin3Score: 1800,
    obstacleSkin4Score: 3000,
    obstacleSkin5Score: 4400,

    storageKey: "YONA_SPACE_DAILY_V3"
  };

  const PATH = "assets/";
  const SE_PATH = "assets/se/";

  const $ = (id) => document.getElementById(id);

  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = CONFIG.canvasW;
  canvas.height = CONFIG.canvasH;
  ctx.imageSmoothingEnabled = false;

  const el = {
    startBtn: $("startBtn"),
    retryBtn: $("retryBtn"),
    resetBtn: $("resetBtn"),
    resetYesBtn: $("resetYesBtn"),
    resetNoBtn: $("resetNoBtn"),
    soundBtn: $("soundBtn"),
    jumpBtn: $("jumpBtn"),
    downBtn: $("downBtn"),

    startOverlay: $("startOverlay"),
    countdown: $("countdown"),
    gameOverModal: $("gameOverModal"),
    resetModal: $("resetModal"),

    creditText: $("creditText"),
    bestScoreText: $("bestScoreText"),
    scoreText: $("scoreText"),
    coinText: $("coinText"),

    runScoreText: $("runScoreText"),
    coinBonusText: $("coinBonusText"),
    totalScoreText: $("totalScoreText"),
    creditLeftText: $("creditLeftText")
  };

  const images = loadImages({
    idle: "ch_01.png",
    run1: "ch_02.png",
    run2: "ch_03.png",
    jump: "ch_04.png",
    down: "ch_05.png",
    crash: "ch_06.png",
    coin: "coin.png",
    dk: "DK.png",
    bg: "bg.png",
    block1: "block.png",
    block2: "block02.png",
    block3: "block03.png",
    block4: "block04.png",
    block5: "block05.png"
  });

  const audio = {
    cd: new Audio(SE_PATH + "cd.mp3"),
    bgm: new Audio(SE_PATH + "bam.mp3"),
    jump: new Audio(SE_PATH + "junp.mp3"),
    down: new Audio(SE_PATH + "down.mp3"),
    coin: new Audio(SE_PATH + "coin.mp3"),
    clash: new Audio(SE_PATH + "clash.mp3"),
    dk: new Audio(SE_PATH + "dk.mp3")
  };

  audio.bgm.loop = true;
  audio.dk.loop = true;
  audio.bgm.volume = 0.58;
  audio.dk.volume = 0.78;

  let dailyData = loadDailyData();
  let soundOn = true;
  let state = "ready";
  let rafId = null;
  let lastTime = 0;

  let bgX = 0;
  let score = 0;
  let coins = 0;
  let speed = CONFIG.baseSpeed;

  let nextObstacleX = 0;
  let nextItemX = 0;
  let dkUntil = 0;

  let floatTexts = [];
  let obstacles = [];
  let items = [];

  const player = {
    x: 130,
    y: CONFIG.groundY,
    w: CONFIG.playerW,
    h: CONFIG.playerH,
    vy: 0,
    isJumping: false,
    isDown: false,
    downUntil: 0,
    frameTimer: 0,
    frame: 0
  };

  function loadImages(map) {
    const out = {};

    Object.entries(map).forEach(([key, file]) => {
      const img = new Image();
      img.src = PATH + file;
      out[key] = img;
    });

    return out;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pad(num, len = 4) {
    return String(Math.max(0, Math.floor(num))).padStart(len, "0");
  }

  function todayKeyJst() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
  }

  function loadDailyData() {
    const today = todayKeyJst();

    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      const data = raw ? JSON.parse(raw) : null;

      if (!data || data.date !== today) {
        return {
          date: today,
          credit: CONFIG.dailyCredit,
          bestScore: 0
        };
      }

      return {
        date: today,
        credit: Math.max(0, Math.min(CONFIG.dailyCredit, Number(data.credit) || 0)),
        bestScore: Math.max(0, Number(data.bestScore) || 0)
      };
    } catch (_) {
      return {
        date: today,
        credit: CONFIG.dailyCredit,
        bestScore: 0
      };
    }
  }

  function saveDailyData() {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(dailyData));
  }

  function updateHud() {
    el.creditText.textContent = String(dailyData.credit).padStart(2, "0");
    el.bestScoreText.textContent = pad(dailyData.bestScore, 4);
    el.scoreText.textContent = pad(score, 4);
    el.coinText.textContent = String(coins).padStart(2, "0");

    const noCredit = dailyData.credit <= 0;
    const busy = state === "countdown" || state === "playing";

    el.startBtn.disabled = noCredit || busy;
    el.startBtn.textContent = noCredit ? "NO CREDIT" : "START";

    el.retryBtn.disabled = busy;
    el.retryBtn.textContent = noCredit ? "BACK TO TOP" : "RETRY";
  }

  function play(name, restart = true) {
    if (!soundOn || !audio[name]) return;

    try {
      if (restart) audio[name].currentTime = 0;
      audio[name].play().catch(() => {});
    } catch (_) {}
  }

  function stopAudio(name) {
    if (!audio[name]) return;

    try {
      audio[name].pause();
      audio[name].currentTime = 0;
    } catch (_) {}
  }

  function stopLoops() {
    stopAudio("bgm");
    stopAudio("dk");
  }

  function resetRun() {
    score = 0;
    coins = 0;
    speed = CONFIG.baseSpeed;

    bgX = 0;
    dkUntil = 0;

    obstacles = [];
    items = [];
    floatTexts = [];

    nextObstacleX = canvas.width + 180;
    nextItemX = canvas.width + 360;

    Object.assign(player, {
      x: 130,
      y: CONFIG.groundY,
      w: CONFIG.playerW,
      h: CONFIG.playerH,
      vy: 0,
      isJumping: false,
      isDown: false,
      downUntil: 0,
      frameTimer: 0,
      frame: 0
    });

    updateHud();
  }

  function hardReset() {
    cancelAnimationFrame(rafId);
    stopLoops();

    state = "ready";

    resetRun();

    el.gameOverModal.classList.add("hidden");
    el.resetModal.classList.add("hidden");
    el.countdown.classList.add("hidden");
    el.startOverlay.classList.remove("hidden");

    el.jumpBtn.disabled = true;
    el.downBtn.disabled = true;

    draw(performance.now());
  }

  function backToTop() {
    cancelAnimationFrame(rafId);
    stopLoops();

    state = "ready";

    resetRun();

    el.gameOverModal.classList.add("hidden");
    el.resetModal.classList.add("hidden");
    el.countdown.classList.add("hidden");
    el.startOverlay.classList.remove("hidden");

    el.jumpBtn.disabled = true;
    el.downBtn.disabled = true;

    updateHud();
    draw(performance.now());
  }

  function resetDailyData() {
    dailyData = {
      date: todayKeyJst(),
      credit: CONFIG.dailyCredit,
      bestScore: 0
    };

    saveDailyData();
    hardReset();
  }

  function openResetModal() {
    el.resetModal.classList.remove("hidden");
  }

  function closeResetModal() {
    el.resetModal.classList.add("hidden");
  }

  function consumeCreditOnGameOver(totalScore) {
    dailyData.credit = Math.max(0, dailyData.credit - 1);

    if (totalScore > dailyData.bestScore) {
      dailyData.bestScore = totalScore;
    }

    saveDailyData();
  }

  function startCountdown() {
    dailyData = loadDailyData();

    if (dailyData.credit <= 0) {
      updateHud();
      return;
    }

    if (state === "countdown" || state === "playing") return;

    state = "countdown";

    resetRun();

    el.gameOverModal.classList.add("hidden");
    el.resetModal.classList.add("hidden");
    el.startOverlay.classList.add("hidden");
    el.countdown.classList.remove("hidden");

    el.jumpBtn.disabled = true;
    el.downBtn.disabled = true;

    const seq = ["3", "2", "1", "GO!"];
    let i = 0;

    el.countdown.textContent = seq[i];

    play("cd");

    const tick = () => {
      i += 1;

      if (i < seq.length) {
        el.countdown.textContent = seq[i];
        setTimeout(tick, 1000);
        return;
      }

      setTimeout(() => {
        el.countdown.classList.add("hidden");
        beginPlay();
      }, 500);
    };

    setTimeout(tick, 1000);
  }

  function beginPlay() {
    state = "playing";
    lastTime = performance.now();

    el.jumpBtn.disabled = false;
    el.downBtn.disabled = false;

    audio.bgm.volume = 0.58;
    play("bgm", false);

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function gameOver() {
    if (state !== "playing") return;

    state = "gameover";

    cancelAnimationFrame(rafId);
    stopLoops();
    play("clash");

    const runScore = Math.floor(score);
    const coinBonus = coins * CONFIG.coinBonus;
    const totalScore = runScore + coinBonus;

    consumeCreditOnGameOver(totalScore);

    el.runScoreText.textContent = pad(runScore, 4);
    el.coinBonusText.textContent = "+" + pad(coinBonus, 4);
    el.totalScoreText.textContent = pad(totalScore, 4);
    el.creditLeftText.textContent = String(dailyData.credit).padStart(2, "0");

    el.jumpBtn.disabled = true;
    el.downBtn.disabled = true;

    updateHud();
    draw(performance.now());

    setTimeout(() => {
      el.gameOverModal.classList.remove("hidden");
    }, 380);
  }

  function jump() {
    if (state !== "playing") return;
    if (player.isJumping) return;

    player.vy = CONFIG.jumpPower;
    player.isJumping = true;
    player.isDown = false;

    play("jump");
  }

  function down() {
    if (state !== "playing") return;

    player.isDown = true;
    player.downUntil = performance.now() + 520;

    if (player.isJumping) {
      player.vy += 5.8;
    }

    play("down");
  }

  function loop(now) {
    if (state !== "playing") return;

    const dt = Math.min(32, now - lastTime);
    lastTime = now;

    update(dt, now);
    draw(now);

    rafId = requestAnimationFrame(loop);
  }

  function update(dt, now) {
    const scale = dt / 16.67;

    score += speed * 0.16 * scale;
    speed = Math.min(CONFIG.maxSpeed, CONFIG.baseSpeed + score / CONFIG.speedUpEvery);

    bgX -= speed * CONFIG.bgSpeedRate * scale;

    player.frameTimer += dt;
    if (player.frameTimer > 110) {
      player.frameTimer = 0;
      player.frame = 1 - player.frame;
    }

    player.vy += CONFIG.gravity * scale;
    player.y += player.vy * scale;

    if (player.y >= CONFIG.groundY) {
      player.y = CONFIG.groundY;
      player.vy = 0;
      player.isJumping = false;
    }

    if (player.isDown && now > player.downUntil) {
      player.isDown = false;
    }

    spawnObstacle();
    spawnItem();
    moveObjects(scale, now);
    checkCollisions(now);
    updateHud();
  }

  function currentBlockImage() {
    if (score >= CONFIG.obstacleSkin5Score) {
      const blocks = [
        images.block1,
        images.block2,
        images.block3,
        images.block4,
        images.block5
      ];

      return blocks[Math.floor(Math.random() * blocks.length)];
    }

    if (score >= CONFIG.obstacleSkin4Score) return images.block5;
    if (score >= CONFIG.obstacleSkin3Score) return images.block4;
    if (score >= CONFIG.obstacleSkin2Score) return images.block3;
    if (score >= 400) return images.block2;

    return images.block1;
  }

  function spawnObstacle() {
    if (nextObstacleX > canvas.width) {
      nextObstacleX -= speed;
      return;
    }

    const type = Math.random() < 0.56 ? "low" : "high";
    const blockSize = CONFIG.blockSize;

    if (type === "low") {
      obstacles.push({
        type,
        x: canvas.width + 30,
        y: CONFIG.groundY + 12 - blockSize,
        w: blockSize,
        h: blockSize,
        blockSize,
        columns: 1,
        rows: 1,
        img: currentBlockImage()
      });
    } else {
      obstacles.push({
        type,
        x: canvas.width + 30,
        y: CONFIG.groundY - CONFIG.playerH - 34,
        w: blockSize,
        h: blockSize,
        blockSize,
        columns: 1,
        rows: 1,
        img: currentBlockImage()
      });
    }

    nextObstacleX = canvas.width + rand(CONFIG.obstacleGapMin, CONFIG.obstacleGapMax);
  }

  function spawnItem() {
    if (nextItemX > canvas.width) {
      nextItemX -= speed;
      return;
    }

    const isDk = Math.random() < CONFIG.dkRate;
    const lane = [
      CONFIG.groundY - CONFIG.coinSize - 10,
      CONFIG.groundY - CONFIG.playerH - 28,
      CONFIG.groundY - CONFIG.playerH - 112
    ][Math.floor(Math.random() * 3)];

    if (isDk || Math.random() < CONFIG.coinRate) {
      const size = isDk ? CONFIG.dkSize : CONFIG.coinSize;

      items.push({
        kind: isDk ? "dk" : "coin",
        x: canvas.width + 30,
        y: lane,
        w: size,
        h: size,
        spin: 0,
        got: false
      });
    }

    nextItemX = canvas.width + rand(CONFIG.itemGapMin, CONFIG.itemGapMax);
  }

  function moveObjects(scale, now) {
    obstacles.forEach((o) => {
      o.x -= speed * scale;
    });

    items.forEach((item) => {
      item.x -= speed * scale;
      item.spin += 0.08 * scale;
    });

    floatTexts.forEach((text) => {
      text.y -= 1.1 * scale;
      text.life -= 16.67 * scale;
    });

    obstacles = obstacles.filter((o) => o.x + o.w > -100);
    items = items.filter((item) => item.x + item.w > -100 && !item.got);
    floatTexts = floatTexts.filter((text) => text.life > 0);

    if (dkUntil && now > dkUntil) {
      dkUntil = 0;
      stopAudio("dk");

      if (state === "playing") {
        audio.bgm.volume = 0.58;
        play("bgm", false);
      }
    }
  }

  function playerHitbox() {
    const h = player.isDown && !player.isJumping ? CONFIG.playerDownH : player.h;
    const y = player.y - h;

    return {
      x: player.x + 18,
      y: y + 10,
      w: player.w - 30,
      h: h - 16
    };
  }

  function rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function checkCollisions(now) {
    const p = playerHitbox();

    for (const item of items) {
      if (item.got) continue;

      if (rectsOverlap(p, item)) {
        item.got = true;

        if (item.kind === "coin") {
          coins += 1;
          floatTexts.push({ text: "+100", x: item.x + item.w / 2, y: item.y, life: 650 });
          play("coin");
        } else {
          dkUntil = now + CONFIG.dkDurationMs;
          floatTexts.push({ text: "DK!", x: item.x + item.w / 2, y: item.y, life: 900 });
          audio.bgm.volume = 0.12;
          play("dk", false);
        }
      }
    }

    for (const ob of obstacles) {
      const hitbox = {
        x: ob.x + 8,
        y: ob.y + 8,
        w: ob.w - 16,
        h: ob.h - 12
      };

      if (rectsOverlap(p, hitbox)) {
        if (dkUntil && now < dkUntil) {
          ob.x = -999;
          play("coin");
          floatTexts.push({ text: "BREAK!", x: p.x + 30, y: p.y, life: 620 });
        } else {
          gameOver();
        }

        break;
      }
    }
  }

  function draw(now) {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBg();
    drawStage();
    drawItems(now);
    drawObstacles();
    drawPlayer(now);
    drawFloatTexts();

    if (dkUntil && now < dkUntil) {
      drawDkGauge(now);
    }
  }

  function drawBg() {
    const bg = images.bg;

    if (bg.complete && bg.naturalWidth) {
      const scale = canvas.height / bg.naturalHeight;
      const tileW = Math.ceil(bg.naturalWidth * scale);
      const tileH = canvas.height;

      let x = bgX % tileW;
      if (x > 0) x -= tileW;

      for (; x < canvas.width; x += tileW) {
        ctx.drawImage(bg, Math.round(x), 0, tileW, tileH);
      }

      return;
    }

    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "#071d20");
    g.addColorStop(1, "#1c1230");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawStage() {
    ctx.fillStyle = "rgba(8,10,13,0.50)";
    ctx.fillRect(0, CONFIG.groundY + 12, canvas.width, 84);

    ctx.strokeStyle = "rgba(116,198,186,0.65)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, CONFIG.groundY + 12);
    ctx.lineTo(canvas.width, CONFIG.groundY + 12);
    ctx.stroke();
  }

  function drawObstacles() {
    for (const o of obstacles) {
      for (let c = 0; c < o.columns; c++) {
        for (let r = 0; r < o.rows; r++) {
          ctx.drawImage(
            o.img,
            Math.round(o.x + c * o.blockSize),
            Math.round(o.y + r * o.blockSize),
            o.blockSize,
            o.blockSize
          );
        }
      }
    }
  }

  function drawItems(now) {
    for (const item of items) {
      ctx.save();

      const pulse = Math.sin(now / 130 + item.x * 0.03) * 3;

      if (item.kind === "coin") {
        ctx.drawImage(images.coin, Math.round(item.x), Math.round(item.y + pulse), item.w, item.h);
      } else {
        ctx.globalAlpha = 0.96;
        ctx.shadowBlur = 22;
        ctx.shadowColor = "#39ffd9";
        ctx.drawImage(images.dk, Math.round(item.x), Math.round(item.y + pulse), item.w, item.h);
      }

      ctx.restore();
    }
  }

  function drawPlayer(now) {
    let img = images.idle;
    let h = player.h;
    let y = player.y - h;

    if (state === "gameover") {
      img = images.crash;
    } else if (player.isDown && !player.isJumping) {
      img = images.down;
      h = CONFIG.playerDownH;
      y = player.y - h;
    } else if (player.isJumping) {
      img = images.jump;
    } else if (state === "playing") {
      img = player.frame ? images.run1 : images.run2;
    }

    ctx.save();

    if (dkUntil && now < dkUntil) {
      const hue = Math.floor((now / 5) % 360);

      ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
      ctx.shadowBlur = 24;
      ctx.globalAlpha = 0.78 + Math.sin(now / 60) * 0.18;
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(player.x + player.w / 2, y + h / 2, 58 + Math.sin(now / 80) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.drawImage(img, Math.round(player.x), Math.round(y), player.w, h);
    ctx.restore();
  }

  function drawFloatTexts() {
    ctx.save();
    ctx.font = "900 22px sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 4;

    for (const text of floatTexts) {
      const alpha = Math.max(0, Math.min(1, text.life / 650));
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.fillStyle = "#39ffd9";
      ctx.strokeText(text.text, text.x, text.y);
      ctx.fillText(text.text, text.x, text.y);
    }

    ctx.restore();
  }

  function drawDkGauge(now) {
    const left = Math.max(0, dkUntil - now);
    const ratio = left / CONFIG.dkDurationMs;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.44)";
    ctx.fillRect(18, 18, 174, 24);

    ctx.fillStyle = "rgba(57,255,217,0.84)";
    ctx.fillRect(22, 22, 166 * ratio, 16);

    ctx.fillStyle = "white";
    ctx.font = "900 12px sans-serif";
    ctx.fillText("DK MODE", 72, 35);
    ctx.restore();
  }

  function renderSound() {
    el.soundBtn.setAttribute("aria-pressed", String(soundOn));
  }

  function toggleSound() {
    soundOn = !soundOn;

    renderSound();

    Object.values(audio).forEach((a) => {
      a.muted = !soundOn;
    });

    if (!soundOn) {
      stopLoops();
    } else if (state === "playing") {
      play("bgm", false);
      if (dkUntil && performance.now() < dkUntil) {
        play("dk", false);
      }
    }
  }

  function handleRetryClick() {
    dailyData = loadDailyData();

    if (dailyData.credit <= 0) {
      backToTop();
      return;
    }

    startCountdown();
  }

  function bindEvents() {
    el.startBtn.addEventListener("click", startCountdown);
    el.retryBtn.addEventListener("click", handleRetryClick);
    el.resetBtn.addEventListener("click", openResetModal);
    el.resetYesBtn.addEventListener("click", resetDailyData);
    el.resetNoBtn.addEventListener("click", closeResetModal);
    el.soundBtn.addEventListener("click", toggleSound);

    el.jumpBtn.addEventListener("click", jump);
    el.downBtn.addEventListener("click", down);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }

      if (e.code === "ArrowDown") {
        e.preventDefault();
        down();
      }

      if (e.code === "Enter" && state === "ready") {
        startCountdown();
      }

      if (e.code === "Enter" && state === "gameover") {
        handleRetryClick();
      }

      if (e.code === "Escape") {
        closeResetModal();
      }
    });

    window.addEventListener("blur", () => {
      if (state === "playing") audio.bgm.pause();
      if (dkUntil) audio.dk.pause();
    });

    window.addEventListener("focus", () => {
      if (state === "playing" && soundOn) {
        audio.bgm.play().catch(() => {});
        if (dkUntil) audio.dk.play().catch(() => {});
      }
    });
  }

  function init() {
    resetRun();

    el.jumpBtn.disabled = true;
    el.downBtn.disabled = true;

    renderSound();
    bindEvents();
    updateHud();

    Promise.all(
      Object.values(images).map((img) => new Promise((resolve) => {
        if (img.complete) {
          resolve();
          return;
        }

        img.onload = resolve;
        img.onerror = resolve;
      }))
    ).then(() => {
      draw(performance.now());
    });
  }

  init();
})();