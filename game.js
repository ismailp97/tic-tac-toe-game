let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

function displayBoard() {
  console.log("Current Board:");
  console.log(`
      ${board[0]} | ${board[1]} | ${board[2]}
     -----------
      ${board[3]} | ${board[4]} | ${board[5]}
     -----------
      ${board[6]} | ${board[7]} | ${board[8]}
    `);
}

function displayNumberedBoard() {
  console.log("This is what position each number repesents:");
  console.log(`
      1 | 2 | 3
     -----------
      4 | 5 | 6
     -----------
      7 | 8 | 9
    `);
}

class Player {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.score = 0;
  }
}

class HumanPlayer extends Player {
  constructor(name, role) {
    super(name, role);
  }
}

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function resetBoard() {
  board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
}

function checkWin(choice) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winPatterns.length; i++) {
    const pattern = winPatterns[i];
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];
    if (board[a] === choice && board[b] === choice && board[c] === choice) {
      return true;
    }
  }

  return false;
}

function isBoardFull() {
  return !(board.includes(" "));
}

function playRound(currentRound, totalRounds) {

  if (currentRound > totalRounds) {
    rl.question(
      `Would you like to play another 5 rounds? Type yes/no\n`,
      (answer) => {
        if (answer.toLowerCase() === "yes") {
          console.log("Starting new game of 5 rounds");
            player1.score = 0;
            player2.score = 0;
            console.log("Scores have been reset");
          playRound(1, 5);
        } else {
          console.log("Thanks for playing!");
          rl.close();
        }
      }
    );
    return;
  }

  resetBoard();

  console.log(
    "\nThis is round " + currentRound + " out of " + totalRounds + " rounds"
  );
  displayBoard();
  takeTurns(player1, player2, () => {
    console.log(`Round ${currentRound} complete.`);
    console.log(
      `Scores: ${player1.name}: ${player1.score}, ${player2.name}: ${player2.score}`
    );
    playRound(currentRound + 1, totalRounds);
  });

}

function takeTurn(player, onMoveComplete) {
  rl.question(
    `${player.name} (${player.role}) - Pick a cell (1-9):\n`,
    (choice) => {
      const index = choice - 1;

      if (!(index >= 0 && index <= 8)) {
        console.log("Invalid choice - Please choose a number between 1 and 9.");
        takeTurn(player, onMoveComplete);
        return;
      }

      if (board[index] !== " ") {
        console.log("That cell is already taken. Choose another.");
        takeTurn(player, onMoveComplete);
        return;
      }

      board[index] = player.role;
      displayBoard();

      if (checkWin(player.role)) {
        console.log(`${player.name} wins this round!`);
        player.score++;
        onMoveComplete(true);
        return;
      }

      if (isBoardFull()) {
        console.log("It's a tie!");
        onMoveComplete(true);
        return;
      }

      onMoveComplete(false);
    }
  );
}

function takeTurns(player1, player2, onRoundComplete) {
  let currentPlayer = player1;
  function nextTurn() {
    takeTurn(currentPlayer, (roundEnded) => {
      if (roundEnded) {
        onRoundComplete();
        return;
      }

      // switch player
      if (currentPlayer === player1) {
        currentPlayer = player2;
      } else {
        currentPlayer = player1;
      }

      nextTurn();
    });
  }

  nextTurn();
}


// player1 - O
// player2 - X
let player1 = new HumanPlayer("Player1Name", "O");
let player2 = new HumanPlayer("Player2Name", "X");

console.log("Welcome to Tic Tac Toe!");

displayNumberedBoard();

// start with setting current round to 1st then up to 5
playRound(1, 5);
