const board = document.getElementById("board");
const message = document.getElementById("message");
const currentPlayerSpan = document.getElementById("currentPlayer");

// Fake Monopoly-style spaces
const spaces = [
  "GO", "Maple Ave", "Chance", "Oak St", "Tax",
  "Rail Line", "Pine Rd", "Chance", "Cedar Ln", "Elm St",
  "JAIL", "Birch Blvd", "Utility", "Ash Ct", "Spruce Way",
  "Rail Line", "Willow Dr", "Chance", "Poplar Pl", "Fir St",
  "FREE", "Cherry Ln", "Chance", "Palm Rd", "Tax",
  "Rail Line", "Olive St", "Chance", "Peach Ave", "Plum Ct",
  "GO TO JAIL", "Apple Rd", "Berry St", "Utility", "Grape Ln",
  "Rail Line", "Chance", "Lemon Way", "Orange Ave", "Park"
];

// Player data
let players = [
  { pos: 0 },
  { pos: 0 }
];

let currentPlayer = 0;

// Board mapping (square path)
const path = [
  ...Array(11).keys().map(i => [10, 10 - i]),
  ...Array(10).keys().map(i => [9 - i, 0]),
  ...Array(10).keys().map(i => [0, i + 1]),
  ...Array(10).keys().map(i => [i + 1, 10])
];

// Draw board
function drawBoard() {
  board.innerHTML = "";

  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const div = document.createElement("div");

      const index = path.findIndex(p => p[0] === r && p[1] === c);

      if (index !== -1) {
        div.className = "space";
        div.innerText = spaces[index];

        players.forEach((p, i) => {
          if (p.pos === index) {
            const token = document.createElement("div");
            token.className = `token p${i + 1}`;
            div.appendChild(token);
          }
        });

        if (index % 10 === 0) div.classList.add("corner");
      }

      board.appendChild(div);
    }
  }
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  players[currentPlayer].pos =
    (players[currentPlayer].pos + roll) % spaces.length;

  message.innerText = `Player ${currentPlayer + 1} rolled a ${roll}`;
  currentPlayer = (currentPlayer + 1) % players.length;
  currentPlayerSpan.innerText = currentPlayer + 1;

  drawBoard();
}

// Initial draw
drawBoard();
