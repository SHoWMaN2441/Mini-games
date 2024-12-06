const board = document.getElementById("board");
const status = document.getElementById("status");
const playComputerButton = document.getElementById("playComputer");
const playFriendButton = document.getElementById("playFriend");
const goToTelegramButton = document.getElementById("goToTelegram");

let currentPlayer = "X";
let gameActive = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
let mode = ""; // 'computer' or 'friend'

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function goToTelegram() {
  window.location.href = "https://t.me/Aslonov_Davronbek";
}

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", index);
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  });
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWin()) {
    drawWinLine();
    status.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (gameState.every((cell) => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  if (mode === "computer" && currentPlayer === "X") {
    currentPlayer = "O";
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function computerMove() {
  const bestMove = getBestMove();
  gameState[bestMove] = "O";
  const cell = board.querySelector(`[data-index='${bestMove}']`);
  cell.textContent = "O";
  cell.classList.add("taken");

  if (checkWin()) {
    drawWinLine();
    status.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (gameState.every((cell) => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function getBestMove() {
  function minimax(board, depth, isMaximizing) {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    if (board.every((cell) => cell !== "")) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      board.forEach((_, i) => {
        if (board[i] === "") {
          board[i] = "O";
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = "";
        }
      });
      return best;
    } else {
      let best = Infinity;
      board.forEach((_, i) => {
        if (board[i] === "") {
          board[i] = "X";
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = "";
        }
      });
      return best;
    }
  }

  let bestMove = -1;
  let bestValue = -Infinity;
  gameState.forEach((_, i) => {
    if (gameState[i] === "") {
      gameState[i] = "O";
      const moveValue = minimax(gameState, 0, false);
      gameState[i] = "";
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = i;
      }
    }
  });
  return bestMove;
}

function checkWin() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      return condition;
    }
  }
  return null;
}

function drawWinLine() {
  const winningCombination = checkWin();
  if (!winningCombination) return;

  const [start, middle, end] = winningCombination;
  const startCell = board.children[start];
  const endCell = board.children[end];

  const line = document.createElement("div");
  line.classList.add("win-line");
  board.appendChild(line);

  const x1 = startCell.offsetLeft + startCell.offsetWidth / 2;
  const y1 = startCell.offsetTop + startCell.offsetHeight / 2;
  const x2 = endCell.offsetLeft + endCell.offsetWidth / 2;
  const y2 = endCell.offsetTop + endCell.offsetHeight / 2;

  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg) scaleX(${
    distance / 300
  })`;
}

function checkWinner(player) {
  return winningConditions.some(([a, b, c]) => {
    return (
      gameState[a] === player &&
      gameState[b] === player &&
      gameState[c] === player
    );
  });
}

function startGame(selectedMode) {
  mode = selectedMode;
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  createBoard();
  currentPlayer = "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
}

playComputerButton.addEventListener("click", () => {
  startGame("computer");
});

playFriendButton.addEventListener("click", () => {
  startGame("friend");
});
