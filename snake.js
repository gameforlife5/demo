const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const controlButtons = document.querySelectorAll("[data-direction]");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speed = 110;

let snake;
let direction;
let queuedDirection;
let food;
let score;
let loopId;
let started = false;
let gameOver = false;

function resetGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  queuedDirection = { ...direction };
  score = 0;
  started = false;
  gameOver = false;
  scoreEl.textContent = score;
  statusEl.textContent = "Press any arrow key to start";
  spawnFood();
  clearInterval(loopId);
  drawBoard();
}

function spawnFood() {
  while (true) {
    const x = Math.floor(Math.random() * tileCount);
    const y = Math.floor(Math.random() * tileCount);
    if (!snake.some((segment) => segment.x === x && segment.y === y)) {
      food = { x, y };
      break;
    }
  }
}

function gameLoop() {
  const head = { ...snake[0] };
  direction = queuedDirection;
  head.x += direction.x;
  head.y += direction.y;

  if (hitWall(head) || hitSelf(head)) {
    handleGameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    spawnFood();
    statusEl.textContent = "Nice!";
  } else {
    snake.pop();
  }

  drawBoard();
}

function hitWall(head) {
  return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
}

function hitSelf(head) {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}

function drawBoard() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#334155";
  for (let x = 0; x < tileCount; x++) {
    for (let y = 0; y < tileCount; y++) {
      ctx.globalAlpha = (x + y) % 2 === 0 ? 0.08 : 0.04;
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#f97316";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#22d3ee" : "#38bdf8";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  });
}

function handleGameOver() {
  gameOver = true;
  statusEl.textContent = "Game over! Press Play again.";
  clearInterval(loopId);
  ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
  ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  ctx.fillStyle = "#f87171";
  ctx.font = "bold 24px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 + 8);
}

function startLoop() {
  clearInterval(loopId);
  loopId = setInterval(gameLoop, speed);
}

function queueDirection(newDirection) {
  if (gameOver) return;
  const isOpposite = direction.x === -newDirection.x && direction.y === -newDirection.y;
  if (isOpposite) return;
  queuedDirection = newDirection;
  if (!started) {
    statusEl.textContent = "";
    started = true;
    startLoop();
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      queueDirection({ x: 0, y: -1 });
      break;
    case "ArrowDown":
    case "s":
    case "S":
      queueDirection({ x: 0, y: 1 });
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      queueDirection({ x: -1, y: 0 });
      break;
    case "ArrowRight":
    case "d":
    case "D":
      queueDirection({ x: 1, y: 0 });
      break;
  }
});

restartBtn.addEventListener("click", resetGame);

const directionFromDataset = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

controlButtons.forEach((button) => {
  const dir = directionFromDataset[button.dataset.direction];
  if (!dir) return;
  const handle = (event) => {
    event.preventDefault();
    queueDirection(dir);
  };
  button.addEventListener("click", handle);
  button.addEventListener("touchstart", handle, { passive: false });
});

resetGame();
drawBoard();
