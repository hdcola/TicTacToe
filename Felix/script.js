let currentPlayer = "X"; // Player X always starts
let gameBoard = ["", "", "", "", "", "", "", "", ""]; // 3x3 game board
let gameOrder = [];
let gameActive = true;

function saveToLocalStorage(key, array) {
  // transform the array into a string
  const arrayString = JSON.stringify(array);
  // use the key to save the string in local storage
  localStorage.setItem(key, arrayString);
  console.log(`Saved to Local Storage: ${key} => ${arrayString}`);
}

function loadFromLocalStorage() {
  // load the string from local storage using the key
  var allItems = getAllLocalStorageItems();
  if (Object.keys(allItems).length === 0) {
    return [];
  }
  // sort the return with the key
  else {
    let keys = Object.keys(allItems);
    keys.sort();

    // if there is only one key-value pair, return the value
    if (Object.keys(allItems).length === 1) {
      var key = keys[0];
      var item = JSON.parse(allItems[key]);
      return [item];
    }
    // if there are more than one key-value pairs, return the last two values
    else {
      var lastKey = keys[keys.length - 1];
      var secondLastKey = keys[keys.length - 2];
      var lastItem = JSON.parse(allItems[lastKey]);
      var secondLastItem = JSON.parse(allItems[secondLastKey]);
      return [lastItem, secondLastItem];
    }
  }
}

function getAllLocalStorageItems() {
  let items = {}; // create an empty object to store the key-value pairs
  for (let i = 0; i < localStorage.length; i++) {
    // get the key at index i
    let key = localStorage.key(i);
    // get the value of the key
    let value = localStorage.getItem(key);
    // add the key-value pair to the object
    items[key] = value;
  }
  return items;
}

function handlePlayerTurn(clickedCellIndex) {
  if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  updateGameOrder(clickedCellIndex);
  gameBoard[clickedCellIndex] = currentPlayer;
  checkForWinOrDraw();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function cellClicked(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.id.replace("cell-", "")) - 1;
  if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  handlePlayerTurn(clickedCellIndex);
  updateUI();
}

const cells = document.querySelectorAll(".cell");

cells.forEach((cell) => {
  cell.addEventListener("click", cellClicked, false);
});

function updateUI() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = gameBoard[i];
  }
}

function updateGameOrder(clickedCellIndex) {
  gameOrder.push(clickedCellIndex);
}

function announceWinner(player) {
  const messageElement = document.getElementById("gameMessage");
  messageElement.innerText = `Player ${player} Wins!`;
  const timestamp = new Date().getTime();
  var timestampStr = timestamp.toString();
  saveToLocalStorage(timestampStr, gameOrder);
}

function announceDraw() {
  const messageElement = document.getElementById("gameMessage");
  messageElement.innerText = "Game Draw!";
}

const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Left-to-right diagonal
  [2, 4, 6], // Right-to-left diagonal
];

function checkForWinOrDraw() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    announceWinner(currentPlayer);
    gameActive = false;
    return;
  }

  let roundDraw = !gameBoard.includes("");
  if (roundDraw) {
    announceDraw();
    gameActive = false;
    return;
  }
}

function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach((cell) => {
    cell.innerText = "";
  });
  document.getElementById("gameMessage").innerText = "";
  gameOrder = [];
  location.reload();
}

window.onload = function () {
  // sortLocalStorage();
  sortLocalStorage();
  // get the last two game orders from local storage
  let gameOrder = loadFromLocalStorage();
};

function sortLocalStorage() {
  // get all items from Local Storage
  let allItems = getAllLocalStorageItems();
  // sort the keys
  let keys = Object.keys(allItems);
  for (let i = 0; i < keys.length; i++) {
    keys[i] = parseInt(keys[i]);
  }
  keys.sort();
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].toString();
  }

  // create a new object to store the sorted items
  let sortedItems = {};
  // add the sorted items to the new object
  keys.forEach((key) => {
    sortedItems[key] = allItems[key];
  });
  // clear the Local Storage
  localStorage.clear();
  // save the sorted items to Local Storage
  for (let key in sortedItems) {
    localStorage.setItem(key, sortedItems[key]);
  }
}

function dispalyHistoricalOrder(queryClass, interfaceGameOrder) {
  const hcells = document.querySelectorAll("." + queryClass);
  let temp = [];
  for (let i = 0; i < interfaceGameOrder.length; i++) {
    if (i % 2 === 0) {
      hcells[interfaceGameOrder[i]].className = queryClass + " x-img";
      hcells[interfaceGameOrder[i]].innerText = i + 1 - temp.length;
      temp.push(i);
    } else {
      hcells[interfaceGameOrder[i]].className = queryClass + " o-img";
      hcells[interfaceGameOrder[i]].innerText = i + 1 - temp.length;
    }
  }
}

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame, false);
