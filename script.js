const board = document.getElementById("game-board");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const messageText = document.getElementById("message-text");
const nextLevelButton = document.getElementById("next-level");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const playButton = document.getElementById("play-button");

let level = 1;
let timeLeft = 180;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function generateBoard(size) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  const totalCards = size * size;

  const cardValues = [];
  for (let i = 1; i <= totalCards / 2; i++) {
    cardValues.push(i, i);
  }

  cardValues.sort(() => Math.random() - 0.5);
  // let count=0

  cards = cardValues.map((value) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
    return card;
  });

  matchedPairs = 0;
}

function handleCardClick(e) {
  const card = e.target;

  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.value;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.value === card2.dataset.value) {
    matchedPairs++;
    if (matchedPairs === cards.length / 2) {
      endLevel();
    }
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.textContent = "";
    card2.textContent = "";
  }

  flippedCards = [];
}

function startTimer() {
  if (level === 2) {
    timeLeft = 240;
  } else if (level === 5) {
    timeLeft = 300;
  } else {
    timeLeft = 180 + (level - 1) * 60;
  }

  updateTimerDisplay();

  const timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0 || matchedPairs === cards.length / 2) {
      clearInterval(timer);
      if (timeLeft <= 0) {
        endGame(false);
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function endLevel() {
  messageText.textContent = "Tabriklaymiz! Siz darajani tugatdingiz!";
  message.classList.remove("hidden");
}

function endGame(win) {
  if (!win) {
    messageText.textContent = "Vaqt tugadi! O'yin tugadi.";
  }
  message.classList.remove("hidden");
}

nextLevelButton.addEventListener("click", () => {
  level++;
  levelDisplay.textContent = level;
  message.classList.add("hidden");

  let newSize = 4;
  if (level >= 2 && level <= 4) {
    newSize = 6;
  } else if (level >= 5) {
    newSize = 8;
  }

  generateBoard(newSize);
  startTimer();
});

playButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  generateBoard(4);
  startTimer();
});
