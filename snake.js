const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

const TILE_SIZE = 20;
const TILES = canvas.width / TILE_SIZE;
const INITIAL_SPEED = 130;
let tickId = null;
let running = false;
let snake;
let direction;
let nextDirection;
let food;
let score;
let fruitPulse = 0;

const nokiaGreen = '#6ba600';
const darkGreen = '#103c12';
const lighterGreen = '#98d400';

resetGame();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    startGame();
    return;
  }

  if (!running) return;

  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 1) break;
      nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === -1) break;
      nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 1) break;
      nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === -1) break;
      nextDirection = { x: 1, y: 0 };
      break;
  }
});

function startGame() {
  resetGame();
  running = true;
  overlay.textContent = '';
  if (tickId) clearInterval(tickId);
  tickId = setInterval(gameLoop, INITIAL_SPEED);
}

function resetGame() {
  snake = [
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  placeFood();
  running = false;
  fruitPulse = 0;
  drawBoard();
  drawSnake();
  drawFood();
  overlay.textContent = 'Press Enter to start';
}

function gameLoop() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (isCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    placeFood();
  } else {
    snake.pop();
  }

  drawBoard();
  drawFood();
  drawSnake();
  drawScore();
  fruitPulse = (fruitPulse + 1) % 8;
}

function drawBoard() {
  ctx.fillStyle = darkGreen;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0b220b';
  for (let y = 0; y < TILES; y++) {
    for (let x = 0; x < TILES; x++) {
      if ((x + y) % 2 === 0) {
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawSnake() {
  ctx.fillStyle = nokiaGreen;
  snake.forEach((segment, index) => {
    const brightness = index === 0 ? lighterGreen : nokiaGreen;
    ctx.fillStyle = brightness;
    ctx.fillRect(
      segment.x * TILE_SIZE + 2,
      segment.y * TILE_SIZE + 2,
      TILE_SIZE - 4,
      TILE_SIZE - 4
    );
  });
}

function drawFood() {
  const blink = fruitPulse < 4 ? '#c4f000' : '#5d8300';
  ctx.fillStyle = blink;
  ctx.fillRect(food.x * TILE_SIZE + 4, food.y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
}

function drawScore() {
  ctx.fillStyle = '#c4f000';
  ctx.font = '18px "VT323", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE ${score.toString().padStart(3, '0')}`, 10, canvas.height - 10);
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * TILES),
      y: Math.floor(Math.random() * TILES),
    };
  } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

function isCollision(position) {
  if (position.x < 0 || position.y < 0 || position.x >= TILES || position.y >= TILES) {
    return true;
  }

  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

function endGame() {
  running = false;
  clearInterval(tickId);
  overlay.textContent = `Game over! Score ${score}. Press Enter to play again.`;
}
