// --------------------
// 1. Firebase Setup
// --------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --------------------
// 2. Game Data
// --------------------
const board = [
  { name:"START", type:"go"},{name:"Brown A",type:"property",price:60,rent:2,owner:null},{name:"Community",type:"community"},
  {name:"Brown B",type:"property",price:60,rent:4,owner:null},{name:"Income Tax",type:"tax",amount:200},{name:"Rail A",type:"rail",price:200,rent:25,owner:null},
  {name:"Light Blue A",type:"property",price:100,rent:6,owner:null},{name:"Chance",type:"chance"},{name:"Light Blue B",type:"property",price:100,rent:6,owner:null},
  {name:"Light Blue C",type:"property",price:120,rent:8,owner:null},{name:"JAIL",type:"jail"},{name:"Pink A",type:"property",price:140,rent:10,owner:null},
  {name:"Utility A",type:"utility",price:150,owner:null},{name:"Pink B",type:"property",price:140,rent:10,owner:null},{name:"Pink C",type:"property",price:160,rent:12,owner:null},
  {name:"Rail B",type:"rail",price:200,rent:25,owner:null},{name:"Orange A",type:"property",price:180,rent:14,owner:null},{name:"Community",type:"community"},
  {name:"Orange B",type:"property",price:180,rent:14,owner:null},{name:"Orange C",type:"property",price:200,rent:16,owner:null},{name:"FREE PARKING",type:"free"},
  {name:"Red A",type:"property",price:220,rent:18,owner:null},{name:"Chance",type:"chance"},{name:"Red B",type:"property",price:220,rent:18,owner:null},
  {name:"Red C",type:"property",price:240,rent:20,owner:null},{name:"Rail C",type:"rail",price:200,rent:25,owner:null},{name:"Yellow A",type:"property",price:260,rent:22,owner:null},
  {name:"Yellow B",type:"property",price:260,rent:22,owner:null},{name:"Utility B",type:"utility",price:150,owner:null},{name:"Yellow C",type:"property",price:280,rent:24,owner:null},
  {name:"GO TO JAIL",type:"goToJail"},{name:"Green A",type:"property",price:300,rent:26,owner:null},{name:"Green B",type:"property",price:300,rent:26,owner:null},
  {name:"Community",type:"community"},{name:"Green C",type:"property",price:320,rent:28,owner:null},{name:"Rail D",type:"rail",price:200,rent:25,owner:null},
  {name:"Chance",type:"chance"},{name:"Blue A",type:"property",price:350,rent:35,owner:null},{name:"Luxury Tax",type:"tax",amount:100},{name:"Blue B",type:"property",price:400,rent:50,owner:null}
];

let localPlayer = null; // Will be "Player 1" or "Player 2"
let players = {};
let currentPlayerIndex = 0;

// --------------------
// 3. UI Elements
// --------------------
const boardContainer = document.getElementById("boardContainer");
const currentPlayerSpan = document.getElementById("currentPlayer");
const playerMoneySpan = document.getElementById("playerMoney");
const playerPosSpan = document.getElementById("playerPos");
const spaceNameSpan = document.getElementById("spaceName");
const messageP = document.getElementById("message");
const rollBtn = document.getElementById("rollBtn");
const buyBtn = document.getElementById("buyBtn");
const endTurnBtn = document.getElementById("endTurnBtn");
const logList = document.getElementById("logList");

// --------------------
// 4. Generate Board Squares
// --------------------
const boardSquares = [];
for(let i=0;i<board.length;i++){
  const sq = document.createElement("div");
  sq.classList.add("square");
  sq.classList.add(board[i].type);
  sq.innerText = board[i].name;
  boardContainer.appendChild(sq);
  boardSquares.push(sq);
}

// --------------------
// 5. Multiplayer: Join Game
// --------------------
function joinGame(playerName){
  localPlayer = playerName;
  const initData = {
    players:{
      "Player 1": {name:"Player 1", money:1500, position:0, properties:[], inJail:false},
      "Player 2": {name:"Player 2", money:1500, position:0, properties:[], inJail:false}
    },
    currentPlayerIndex: 0
  };
  db.ref("/game").once("value", snap=>{
    if(!snap.exists()){
      db.ref("/game").set(initData);
    }
    listenGame();
  });
}

// --------------------
// 6. Listen to game state changes
// --------------------
function listenGame(){
  db.ref("/game").on("value", snap=>{
    const game = snap.val();
    players = game.players;
    currentPlayerIndex = game.currentPlayerIndex;
    updateUI();
    updateTokens();
    updatePropertiesUI();
  });
}

// --------------------
// 7. Helper functions for UI update
// --------------------
function log(text){
  const li = document.createElement("li");
  li.textContent = text;
  logList.appendChild(li);
  logList.scrollTop = logList.scrollHeight;
}

function updateUI(){
  const playerKeys = Object.keys(players);
  const currentPlayer = playerKeys[currentPlayerIndex];
  currentPlayerSpan.textContent = currentPlayer;
  const local = players[localPlayer];
  if(local){
    playerMoneySpan.textContent = local.money;
    playerPosSpan.textContent = local.position;
    spaceNameSpan.textContent = board[local.position].name;
  }
}

// --------------------
// 8. Display Properties
// --------------------
function updatePropertiesUI(){
  document.getElementById("props1").textContent = players["Player 1"].properties.map(p=>p.name).join(", ") || "None";
  document.getElementById("props2").textContent = players["Player 2"].properties.map(p=>p.name).join(", ") || "None";
}

// --------------------
// 9. Move Tokens
// --------------------
function updateTokens(){
  // Remove old tokens
  document.querySelectorAll(".token").forEach(t=>t.remove());
  Object.values(players).forEach((p,idx)=>{
    const token = document.createElement("div");
    token.classList.add("token", idx===0?"player1":"player2");
    boardSquares[p.position].appendChild(token);
  });
}

// --------------------
// 10. Dice / Buy / End Turn / Trade
// --------------------
// TODO: Add logic to write changes to Firebase so both players see the move

// --------------------
// Join game as prompt
// --------------------
const namePrompt = prompt("Enter player name: Player 1 or Player 2");
joinGame(namePrompt);
