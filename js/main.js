class Player {
  constructor(symbol) {
    this.symbol = symbol; // "X" or "O"
    this.points = [0, 0];
  }
}

class Board {
  constructor() {
    // Store the board as an array of 9 cell (initially empty)
    this.cells = Array(9).fill(null);
    this.boardElement = document.getElementById("board");
  }

  // Create the 3x3 grid dynamically
  renderBoard(onCellClick) {
    this.boardElement.innerHTML = ""; // clear before rendering
    this.cells.forEach((cell, index) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.index = index;

      // If the cell already has a sybol, show it
      if (cell) {
        div.textContent = cell;
        div.classList.add("taken");
      }

      // Attach click handler for moves
      div.addEventListener("click", () => onCellClick(index));
      this.boardElement.appendChild(div);
    });
  }

  // Update a cell with the current player's symbol
  updateCell(index, symbol) {
    if (!this.cells[index]) {
      this.cells[index] = symbol;
      return true; // valid move
    }
    return false; // invalid move (cell already taken)
  }

  // Check if a given symbol ("X" or "O") has won
  checkWin(symbol) {
    const winPatters = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    return winPatters.some((pattern) =>
      pattern.every((i) => this.cells[i] === symbol)
    );
  }

  // Check if all cells are filled
  isFull() {
    return this.cells.every((cell) => cell !== null);
  }

  // Reset the board to empty
  resetBoard() {
    this.cells.fill(null);
  }
}

class Game {
  constructor() {
    this.board = new Board();
    this.players = [new Player("X"), new Player("O")];
    this.score = new Player();
    this.currentPlayerIndex = 0; // start with Player X
    this.statusElement = document.getElementById("status");
    this.scoreElement = document.getElementById("score");
    this.restartButton = document.getElementById("restart");

    // Add event listener for restart button
    this.restartButton.addEventListener("click", () => this.restartGame());
  }

  // Start the game
  start() {
    this.board.renderBoard(this.handleMove.bind(this));
    this.updateStatus(`Player ${this.currentPlayer().symbol}'s turn`);
  }

  // Return the current player object
  currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  // Handle when a player clicks a cell
  handleMove(index) {
    let player = this.currentPlayer();

    // Try to place the symbol in the chosen cell
    if (this.board.updateCell(index, player.symbol)) {
      // Re-render board with update state
      this.board.renderBoard(this.handleMove.bind(this));

      // Check win
      if (this.board.checkWin(player.symbol)) {
        this.updateStatus(`Player ${player.symbol} wins!`);
        this.updateScore(player.symbol);
        this.disableBoard();
        return;
      }

      // Check draw
      if (this.board.isFull()) {
        this.updateStatus(`It's a draw!`);
        return;
      }

      // If no win/draw -> switch player
      this.switchTurn();
      this.updateStatus(`Player ${this.currentPlayer().symbol}'s turn`);
    }
  }

  // Switch to the other player
  switchTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
  }

  // Update score
  updateScore(symbol) {
    console.log(symbol);
    if (symbol === "X") {
      this.score.points[0] += 1;
    } else {
      this.score.points[1] += 1;
    }
    this.scoreElement.textContent = `Score: X - ${this.score.points[0]} | O - ${this.score.points[1]}`;
  }

  // Update status message
  updateStatus(message) {
    this.statusElement.textContent = message;
  }

  // Prevent further moves when game is over
  disableBoard() {
    // Remove all cell event listeners by re-rendering without click handlers
    this.board.boardElement.querySelectorAll(".cell").forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  }

  // Restart the game
  restartGame() {
    this.board.resetBoard();
    this.currentPlayerIndex = 0;
    this.start();
  }
}

// Initialize
window.onload = () => {
  const game = new Game();
  game.start();
};
