export class Board {
  constructor(size) {
    this.size = size;
    this.grid = this.initializeGrid();
    this.guesses = new Set();
  }

  initializeGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  isEmpty(row, col) {
    return this.isValidPosition(row, col) && this.grid[row][col] === '~';
  }

  placeShip(row, col) {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = 'S';
    }
  }

  markGuess(row, col) {
    const guessKey = `${row},${col}`;
    this.guesses.add(guessKey);
  }

  isGuessed(row, col) {
    const guessKey = `${row},${col}`;
    return this.guesses.has(guessKey);
  }

  markHit(row, col) {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = 'X';
    }
  }

  markMiss(row, col) {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = 'O';
    }
  }

  getCell(row, col) {
    if (this.isValidPosition(row, col)) {
      return this.grid[row][col];
    }
    return null;
  }

  getDisplayBoard(showShips = false) {
    return this.grid.map(row => 
      row.map(cell => {
        if (!showShips && cell === 'S') {
          return '~'; // Hide ships from opponent's view
        }
        return cell;
      })
    );
  }

  getAvailablePositions() {
    const positions = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (!this.isGuessed(row, col)) {
          positions.push({ row, col });
        }
      }
    }
    return positions;
  }

  reset() {
    this.grid = this.initializeGrid();
    this.guesses.clear();
  }
} 