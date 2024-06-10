var currentPlayer = "X";
var gameBoard = ["", "", "", "", "", "", "", "", ""];
var gameOrder = [];
var gameActive = true;

const cells = document.querySelectorAll(".cell");

/** List all the ways to win the game. */
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var playedGames = [];

/** The function call localStorage.setItem() to save the result of game.
 * @param {string} key - The key to save the game result.
 * @param {array} array - The array to save the game result.
 */
function saveToLocalStorage(key, array) {
  const arrayString = JSON.stringify(array);
  localStorage.setItem(key, arrayString);
  console.log(`Saved to Local Storage: ${key} => ${arrayString}`);
}

/** The function call the getAllLocalStorageItems() function to get local storage.
 * if length of the items is 1, return the last item.
 * if length of the items is 2, return the last two items.
 * @returns {array} - The array of the game result.
 */
function loadFromLocalStorage() {
  var allItems = getAllLocalStorageItems();
  if (Object.keys(allItems).length === 0) {
    return [];
  } else {
    let keys = Object.keys(allItems);
    keys.sort();
    if (Object.keys(allItems).length === 1) {
      var key = keys[0];
      var item = JSON.parse(allItems[key]);
      return [item];
    } else {
      var lastKey = keys[keys.length - 1];
      var secondLastKey = keys[keys.length - 2];
      var lastItem = JSON.parse(allItems[lastKey]);
      var secondLastItem = JSON.parse(allItems[secondLastKey]);
      return [lastItem, secondLastItem];
    }
  }
}

/** The function get all items from local storage.
 * @returns {object} - The object of the items.
 */
function getAllLocalStorageItems() {
  let items = {};
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    items[key] = value;
  }
  return items;
}

/** The function clear the local storage and reload the page. */
function clearLocalStorage() {
  localStorage.clear();
  location.reload();
}

/** The function get the parameter of last player's input and switch to the other player's turn.
 * @param {number} clickedCellIndex - The index of the clicked cell.
 */
function handlePlayerTurn(clickedCellIndex) {
  if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  updateGameOrder(clickedCellIndex);
  gameBoard[clickedCellIndex] = currentPlayer;
  checkForWinOrDraw(currentPlayer);
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

/** The function get the parameter of clicked cell event and check which cell is clicked.
 * @param {object} clickedCellEvent - The clicked cell event.
 */
function cellClicked(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.id.replace("cell-", "")) - 1;
  if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  handlePlayerTurn(clickedCellIndex);
  updateUI();
}

/** The function update the game board.
 * Traverse the game board and update the cell text.
 */
function updateUI() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = gameBoard[i];
  }
}

/** The function add the clicked cell index to the game order array.
 * For storing the game order.
 * @param {number} clickedCellIndex - The index of the clicked cell.
 */
function updateGameOrder(clickedCellIndex) {
  gameOrder.push(clickedCellIndex);
}

/** The function get the parameter of the winner and announce the winner. */
function checkForWinOrDraw(currentPlayer) {
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
    console.log(currentPlayer);
    if (currentPlayer === "X") {
      playedGames.push(1);
    } else {
      playedGames.push(-1);
    }
    saveToLocalStorage("0", playedGames);
    gameActive = false;
    return;
  }
  let roundDraw = !gameBoard.includes("");
  if (roundDraw) {
    announceDraw();
    playedGames.push(0);
    saveToLocalStorage("0", playedGames);
    gameActive = false;
    return;
  }
}

/** The function check the game board for win.
 * @param {string} player - The player who wins the game.
 * Call the saveToLocalStorage() function to save the game result.
 * The key is the timestamp of the game end.
 */
function announceWinner(player) {
  const messageElement = document.getElementById("gameMessage");
  messageElement.innerText = `Player ${player} Wins!`;
  const timestamp = new Date().getTime();
  var timestampStr = timestamp.toString();
  saveToLocalStorage(timestampStr, gameOrder);
}

/** The function get the parameter of the winner and announce the winner.
 * No save the game result.
 */
function announceDraw() {
  const messageElement = document.getElementById("gameMessage");
  messageElement.innerText = "Game Draw!";
}

/** The function reset the game board and game order. */
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

/** The function get the parameter of the query class and the game order.
 * Renew the game board with the historical order.
 * @param {string} queryClass - The query
 * @param {array} interfaceGameOrder - The game order.
 */
function dispalyHistoricalOrder(queryClass, interfaceGameOrder) {
  const hcells = document.querySelectorAll("." + queryClass);
  let temp = [];
  if (interfaceGameOrder) {
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
}

/** The function load the localstorage record,
 * sort the record and storage the sorted data.
 */
function sortLocalStorage() {
  let allItems = getAllLocalStorageItems();
  let keys = Object.keys(allItems);
  for (let i = 0; i < keys.length; i++) {
    keys[i] = parseInt(keys[i]);
  }
  keys.sort();
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].toString();
  }
  let sortedItems = {};
  keys.forEach((key) => {
    sortedItems[key] = allItems[key];
  });
  localStorage.clear();
  for (let key in sortedItems) {
    localStorage.setItem(key, sortedItems[key]);
  }
}

function loadPlayedGames() {
  playedGames = localStorage.getItem("0");
  if (!playedGames || playedGames.length === 0) {
    playedGames = [];
  } else {
    playedGames = JSON.parse(playedGames);
  }
}

function countWins(playedGames, winner) {
  return playedGames.filter((currentElement) => currentElement === winner)
    .length;
}

function statics() {
  loadPlayedGames();
  if (playedGames && playedGames != null && playedGames.length > 0) {
    let xWins = 0;
    let oWins = 0;
    let draws = 0;
    xWins = countWins(playedGames, 1);
    oWins = countWins(playedGames, -1);
    draws = countWins(playedGames, 0);
    let totalGames = 0;
    let winRateX = 0;
    let winRateO = 0;
    let drawRate = 0;
    totalGames = playedGames.length;
    winRateX = (xWins / totalGames) * 100;
    winRateO = (oWins / totalGames) * 100;
    drawRate = (draws / totalGames) * 100;
    document.getElementById("modalTitle").innerText = "Game Statistics:";
    document.getElementById("winningRateContent").style.display = "block";
    document.getElementById("xWins").innerText = xWins;
    document.getElementById("oWins").innerText = oWins;
    document.getElementById("draws").innerText = draws;
    document.getElementById("totalGames").innerText = totalGames;
    document.getElementById("winRateX").innerText = winRateX.toFixed(2);
    document.getElementById("winRateO").innerText = winRateO.toFixed(2);
    if (xWins > oWins) {
      document.getElementById("xWins").classList.add("emphasize");
      document.getElementById("winRateX").classList.add("emphasize");
    } else {
      document.getElementById("oWins").classList.add("emphasize");
      document.getElementById("winRateO").classList.add("emphasize");
    }
    // document.getElementById("drawRate").innerText = drawRate;
  }
}

/** When page is loaded, call the sortLocalStorage() function to find the last 2 game record.
 * Call the loadFromLocalStorage() function to load the game record.
 * Game order is the last 2 game record, and be called in the html file.
 */
window.onload = function () {
  sortLocalStorage();
  let gameOrder = loadFromLocalStorage();
  statics();
};

/**Add a click event listener for each cell in the game board. */
cells.forEach((cell) => {
  cell.addEventListener("click", cellClicked, false);
});

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame, false);

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearLocalStorage, false);
