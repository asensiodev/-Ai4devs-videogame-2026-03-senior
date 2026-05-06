const CONFIG = {
  gravity: 2200,
  jumpVelocity: 760,
  baseSpeed: 260,
  maxSpeedMultiplier: 1.9,
  speedRampPerSecond: 0.02,
  spawnMinSeconds: 0.82,
  spawnMaxSeconds: 1.55,
  spawnTightness: 0.28,
  minObstacleGapPixels: 190,
  jumpGroundTolerance: 3,
  playerWidth: 42,
  playerHeight: 42,
  playerX: 72,
  groundHeight: 68,
  obstacleWidth: 30,
  obstacleMinHeight: 36,
  obstacleMaxHeight: 74,
  hitboxPadding: 5,
  maxFrameDeltaSeconds: 0.033,
  scorePerSecond: 10,
  spawnOffsetX: 20,
};
const MESSAGES = {
  ready: "Pulsa ESPACIO o FLECHA ARRIBA para empezar",
  running: "Esquiva obstaculos y sobrevive lo maximo posible",
};

const gameEl = document.querySelector("#game");
const playerEl = document.querySelector("#player");
const scoreEl = document.querySelector("#score");
const speedEl = document.querySelector("#speed");
const messageEl = document.querySelector("#message");
const panelEl = document.querySelector(".panel");

const state = {
  phase: "ready",
  time: 0,
  score: 0,
  speed: CONFIG.baseSpeed,
  playerY: 0,
  playerVY: 0,
  obstacles: [],
  nextSpawnIn: randomSpawnDelay(),
  loopId: null,
  lastFrameMs: 0,
};

createGround();
render();
gameEl.focus();

window.addEventListener("keydown", onKeyDown);
gameEl.addEventListener("pointerdown", focusGameArea);

function onKeyDown(event) {
  const jumpPressed = event.code === "Space" || event.code === "ArrowUp";
  const restartPressed = event.code === "KeyR";
  if (event.repeat && jumpPressed) {
    return;
  }

  if (jumpPressed) {
    event.preventDefault();
    if (state.phase === "ready") {
      startGame();
    }
    tryJump();
  }

  if (restartPressed && state.phase === "gameOver") {
    resetGame();
    startGame();
  }
}

function startGame() {
  if (state.phase === "running") {
    return;
  }
  state.phase = "running";
  state.lastFrameMs = performance.now();
  setStatusMessage(MESSAGES.running);
  gameEl.focus();
  state.loopId = requestAnimationFrame(gameLoop);
}

function resetGame() {
  state.phase = "ready";
  state.time = 0;
  state.score = 0;
  state.speed = CONFIG.baseSpeed;
  state.playerY = 0;
  state.playerVY = 0;
  state.nextSpawnIn = randomSpawnDelay();

  for (const obstacle of state.obstacles) {
    obstacle.el.remove();
  }
  state.obstacles = [];
  setStatusMessage(MESSAGES.ready);
  render();
}

function gameLoop(frameMs) {
  if (state.phase !== "running") {
    return;
  }

  const dt = Math.min((frameMs - state.lastFrameMs) / 1000, CONFIG.maxFrameDeltaSeconds);
  state.lastFrameMs = frameMs;

  updateGameState(dt);
  render();

  if (state.phase === "running") {
    state.loopId = requestAnimationFrame(gameLoop);
  }
}

function updateGameState(dt) {
  state.time += dt;
  state.score = Math.floor(state.time * CONFIG.scorePerSecond);
  const desiredMultiplier = 1 + state.time * CONFIG.speedRampPerSecond;
  const speedMultiplier = Math.min(desiredMultiplier, CONFIG.maxSpeedMultiplier);
  state.speed = CONFIG.baseSpeed * speedMultiplier;

  applyPlayerPhysics(dt);
  moveObstacles(dt);
  spawnObstacles(dt);

  if (isCollisionDetected()) {
    endGame();
  }
}

function applyPlayerPhysics(dt) {
  state.playerVY -= CONFIG.gravity * dt;
  state.playerY += state.playerVY * dt;

  if (state.playerY < getGroundY()) {
    state.playerY = getGroundY();
    state.playerVY = 0;
  }
}

function moveObstacles(dt) {
  const deltaX = state.speed * dt;
  for (const obstacle of state.obstacles) {
    obstacle.x -= deltaX;
  }

  state.obstacles = state.obstacles.filter((obstacle) => {
    if (obstacle.x + CONFIG.obstacleWidth < 0) {
      obstacle.el.remove();
      return false;
    }
    return true;
  });
}

function spawnObstacles(dt) {
  state.nextSpawnIn -= dt;
  if (state.nextSpawnIn > 0) {
    return;
  }
  if (!canSpawnObstacle()) {
    state.nextSpawnIn = 0.04;
    return;
  }
  state.nextSpawnIn = randomSpawnDelay();
  createObstacle();
}

function createObstacle() {
  const el = document.createElement("div");
  el.className = "obstacle";

  const height =
    CONFIG.obstacleMinHeight +
    Math.random() * (CONFIG.obstacleMaxHeight - CONFIG.obstacleMinHeight);

  const obstacle = {
    x: gameEl.clientWidth + CONFIG.spawnOffsetX,
    y: getGroundY(),
    width: CONFIG.obstacleWidth,
    height,
    el,
  };

  state.obstacles.push(obstacle);
  gameEl.append(el);
}

function isCollisionDetected() {
  const playerRect = getPlayerHitbox();

  for (const obstacle of state.obstacles) {
    const obstacleRect = getObstacleHitbox(obstacle);
    if (rectOverlap(playerRect, obstacleRect)) {
      return true;
    }
  }
  return false;
}

function rectOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function endGame() {
  state.phase = "gameOver";
  if (state.loopId) {
    cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }
  setStatusMessage(`Game Over · Puntuacion final: ${state.score} · Pulsa R para reiniciar`, true);
  render();
}

function render() {
  const playerBottom = CONFIG.groundHeight + state.playerY;
  playerEl.style.left = `${CONFIG.playerX}px`;
  playerEl.style.bottom = `${playerBottom}px`;

  for (const obstacle of state.obstacles) {
    obstacle.el.style.left = `${obstacle.x}px`;
    obstacle.el.style.height = `${obstacle.height}px`;
  }

  scoreEl.textContent = String(state.score);
  speedEl.textContent = `${(state.speed / CONFIG.baseSpeed).toFixed(1)}x`;
}

function tryJump() {
  if (state.phase !== "running") {
    return;
  }
  if (isPlayerGrounded()) {
    state.playerVY = CONFIG.jumpVelocity;
  }
}

function randomSpawnDelay() {
  const random = Math.random();
  const shaped = Math.pow(random, 1 + CONFIG.spawnTightness);
  return CONFIG.spawnMinSeconds + shaped * (CONFIG.spawnMaxSeconds - CONFIG.spawnMinSeconds);
}

function createGround() {
  const ground = document.createElement("div");
  ground.className = "ground";
  gameEl.append(ground);
}

function getGroundY() {
  return 0;
}

function isPlayerGrounded() {
  return state.playerY <= getGroundY() + CONFIG.jumpGroundTolerance;
}

function getPlayerHitbox() {
  const padding = CONFIG.hitboxPadding;
  return {
    x: CONFIG.playerX + padding,
    y: state.playerY + padding,
    width: CONFIG.playerWidth - padding * 2,
    height: CONFIG.playerHeight - padding * 2,
  };
}

function getObstacleHitbox(obstacle) {
  const padding = CONFIG.hitboxPadding;
  return {
    x: obstacle.x + padding,
    y: obstacle.y + padding + 2,
    width: obstacle.width - padding * 2,
    height: obstacle.height - padding * 2 - 4,
  };
}

function canSpawnObstacle() {
  if (state.obstacles.length === 0) {
    return true;
  }
  const newestObstacle = state.obstacles[state.obstacles.length - 1];
  const gapFromNewest = gameEl.clientWidth + CONFIG.spawnOffsetX - newestObstacle.x;
  return gapFromNewest >= CONFIG.minObstacleGapPixels;
}

function focusGameArea() {
  gameEl.focus();
}

function setStatusMessage(text, isGameOver = false) {
  messageEl.textContent = text;
  panelEl.classList.toggle("game-over", isGameOver);
}
