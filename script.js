// Selecting all required elements on the game
let boxes = document.querySelectorAll(".box");
let newGameBtn = document.querySelector(".newGame");
let winnerModal = document.getElementById("winnerModal");
let winnerText = document.getElementById("winnerText");
let playerXPointsElement = document.getElementById("playerXPoints");
let playerOPointsElement = document.getElementById("playerOPoints");

//setting X as a default user sign
let userSign = "X";
let computerSign = "O";

// Initializing game variables
let turnX = true; // make the first chance for player X
let playerXPoints = 0;
let playerOPoints = 0;

// defining all the winning patterns on the game
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [2, 5, 8],
  [1, 4, 7],
];

// Adding click eventListeners to every game box
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    // Handling player and computer moves
    if (turnX) {
      box.innerText = userSign;
    } else {
      box.innerText = computerSign;
    }
    box.disabled = true; // disable button after move

    // Checking for a winner and switching players
    checkWinner();
    switchPlayer();

    // for computer turn make a move after a short delay
    if (!turnX) {
      setTimeout(makeComputerMove, 500);
    }
  });
});

// Function to display the winner and update points
const showWinner = (winner) => {
  if (winner === userSign) {
    playerXPoints += 5;
  } else if (winner === computerSign) {
    playerOPoints += 5;
  } else {
    playerXPoints += 0;
    playerOPoints += 0;
  }

  // Update the points on leaderBoard
  playerXPointsElement.innerText = playerXPoints;
  playerOPointsElement.innerText = playerOPoints;

  // Displaying winner information and points
  if (winner) {
    if (winner === "X") {
      winnerText.innerHTML = `<span style="font-size: 24px;"> User wins 5 Points &#128526;</span>`;
    } else {
      winnerText.innerHTML = ` <span style="font-size: 20px;"> Computer wins 5 Points &#128531;</span>`;
    }
  } else {
    winnerText.innerHTML = `It's a draw <span style="font-size: 24px;">&#128529;</span>`;
  }

  winnerModal.style.display = "block"; // making winner modal window visible to user after win or draw
};

// Function to check for a winner or draw
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        disableBtn();
        showWinner(pos1Val); // pos1Val is winner because in the for-of loop for every winPattern The value of pos1 is 0 index for every array after each iteration
      }
    }
  }

  // Check for a draw
  if (Array.from(boxes).every((box) => box.innerText !== "")) {
    disableBtn();
    showWinner(null); // Display a draw message
  }
};

// Function for newGAme
const newGame = () => {
  turnX = true;
  enableBtn();
  boxes.forEach((box) => {
    box.innerText = "";
  });
  winnerModal.style.display = "none";
};

// Function to disable all game boxes
const disableBtn = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

// Function to enable all game boxes
const enableBtn = () => {
  for (let box of boxes) {
    box.disabled = false;
  }
};

// Function to switch the player's turn
const switchPlayer = () => {
  turnX = !turnX;
};

// Function for the computer to make a move
const makeComputerMove = () => {
  // Check if the game has already been won or if all boxes are filled
  if (
    Array.from(boxes).every((box) => box.innerText !== "") ||
    winnerModal.style.display === "block"
  ) {
    return;
  }

  // Get all empty boxes
  const emptyBoxes = Array.from(boxes).filter((box) => box.innerText === "");

  // Prioritize winning moves and block user winning moves
  for (let pattern of winPatterns) {
    const [pos1, pos2, pos3] = pattern;
    const values = [
      boxes[pos1].innerText,
      boxes[pos2].innerText,
      boxes[pos3].innerText,
    ];

    // If computer can win then make that move
    if (
      values.filter((value) => value === computerSign).length === 2 &&
      values.includes("")
    ) {
      const winIndex = values.indexOf("");
      boxes[pattern[winIndex]].innerText = computerSign;
      boxes[pattern[winIndex]].disabled = true;
      checkWinner();
      switchPlayer();
      return;
    }

    // If computer needs to block the user from winning so make that move
    if (
      values.filter((value) => value === userSign).length === 2 && // if the user has already made 2 winPatten moves then block the third move
      values.includes("")
    ) {
      const blockIndex = values.indexOf("");
      boxes[pattern[blockIndex]].innerText = computerSign;
      boxes[pattern[blockIndex]].disabled = true;
      checkWinner();
      switchPlayer();
      return;
    }
  }

  // If no winning or blocking moves then make a random move
  if (emptyBoxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    const selectedBox = emptyBoxes[randomIndex];

    // Make the computer move
    selectedBox.innerText = computerSign;
    selectedBox.disabled = true;
    checkWinner();
    switchPlayer();
  }
};

// Adding click event listeners to new game button
newGameBtn.addEventListener("click", newGame);

// Function to close the winner modal
const closeModal = () => {
  winnerModal.style.display = "none";
};

// Adding click eventListener to close the winner modal
winnerModal.addEventListener("click", closeModal);
