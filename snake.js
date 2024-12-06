const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const canvasWidth = canvas.width / boxSize;
const canvasHeight = canvas.height / boxSize;

let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let gameSpeed = 150;
let gameLoopInterval;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvasWidth),
    y: Math.floor(Math.random() * canvasHeight),
  };
}
function redirectToTelegram() {
  window.open("https://t.me/R_15_02", "_blank");
}

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

function drawSnake() {
  snake.forEach((segment) => drawBox(segment.x, segment.y, "green"));
}

function drawFood() {
  drawBox(food.x, food.y, "red");
}

function updateGame() {
  let head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
  }

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasWidth ||
    head.y >= canvasHeight ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    alert(`Game Over! Your score: ${score}`);
    clearInterval(gameLoopInterval);
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "DOWN") direction = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") direction = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") direction = "RIGHT";
      break;
  }
});

function showGame() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".controls").style.display = "block";
  canvas.style.display = "block";
}

function startGame() {
  const difficulty = document.getElementById("difficulty").value;
  switch (difficulty) {
    case "easy":
      gameSpeed = 200;
      break;
    case "medium":
      gameSpeed = 150;
      break;
    case "hard":
      gameSpeed = 100;
      break;
  }

  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  food = spawnFood();

  if (gameLoopInterval) clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
  updateGame();
  drawGame();
}
