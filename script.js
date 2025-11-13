const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');
const scoreValue = document.getElementById('scoreValue');

const BOARD_SIZE = 20;
const CELL_SIZE = canvas.width / BOARD_SIZE;
const SPEED = 140;

const GameState = {
  IDLE: 'idle',
  RUNNING: 'running',
  OVER: 'over',
};

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { ...direction };
let food = null;
let score = 0;
let loopId = null;
let state = GameState.IDLE;

function resetGame() {
  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  updateScore();
  placeFood();
  drawScene();
}

function startGame() {
  if (state === GameState.RUNNING) return;
  resetGame();
  state = GameState.RUNNING;
  statusText.textContent = 'Game in progress';
  if (loopId) clearInterval(loopId);
  loopId = setInterval(step, SPEED);
}

function endGame() {
  state = GameState.OVER;
  statusText.textContent = 'Game over · Press Enter to restart';
  if (loopId) {
    clearInterval(loopId);
    loopId = null;
  }
}

function placeFood() {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  let candidate;
  do {
    candidate = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (occupied.has(`${candidate.x},${candidate.y}`));
  food = candidate;
}

function updateScore() {
  scoreValue.textContent = score.toString().padStart(3, '0');
}

function step() {
  direction = { ...nextDirection };
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  const willGrow = head.x === food.x && head.y === food.y;

  if (isCollision(head, willGrow)) {
    endGame();
    drawScene();
    return;
  }

  snake.unshift(head);

  if (willGrow) {
    score += 10;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  drawScene();
}

function isCollision(position, willGrow) {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= BOARD_SIZE ||
    position.y >= BOARD_SIZE
  ) {
    return true;
  }
  const segmentsToCheck = willGrow ? snake : snake.slice(0, -1);
  return segmentsToCheck.some(
    (segment) => segment.x === position.x && segment.y === position.y
  );
}

function drawScene() {
  ctx.fillStyle = '#89b86a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(33, 70, 33, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 1; i < BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }

  drawFood();
  drawSnake();

  if (state !== GameState.RUNNING) {
    drawMessage(state === GameState.IDLE ? 'Press Enter to start' : 'Game Over');
  }
}

function drawSnake() {
  ctx.fillStyle = '#1b3817';
  ctx.strokeStyle = '#a0d080';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    if (index === 0) {
      ctx.fillStyle = '#10220f';
      ctx.fillRect(
        segment.x * CELL_SIZE + CELL_SIZE * 0.2,
        segment.y * CELL_SIZE + CELL_SIZE * 0.2,
        CELL_SIZE * 0.6,
        CELL_SIZE * 0.6
      );
      ctx.fillStyle = '#1b3817';
    }
  });
}

function drawFood() {
  if (!food) return;
  ctx.fillStyle = '#2c531c';
  ctx.beginPath();
  const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;
  ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawMessage(text) {
  ctx.fillStyle = 'rgba(12, 41, 16, 0.85)';
  ctx.fillRect(40, canvas.height / 2 - 30, canvas.width - 80, 60);
  ctx.strokeStyle = '#cfe8b4';
  ctx.strokeRect(40, canvas.height / 2 - 30, canvas.width - 80, 60);
  ctx.fillStyle = '#e1ffd1';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 6);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    startGame();
    return;
  }

  if (state !== GameState.RUNNING) return;

  const key = event.key;
  if (key === 'ArrowUp' && direction.y !== 1) {
    nextDirection = { x: 0, y: -1 };
  } else if (key === 'ArrowDown' && direction.y !== -1) {
    nextDirection = { x: 0, y: 1 };
  } else if (key === 'ArrowLeft' && direction.x !== 1) {
    nextDirection = { x: -1, y: 0 };
  } else if (key === 'ArrowRight' && direction.x !== -1) {
    nextDirection = { x: 1, y: 0 };
  }
});

resetGame();
statusText.textContent = 'Press Enter to start';
