import { Player } from './Player.js';

export class CPUPlayer extends Player {
  constructor(name, board) {
    super(name, board);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = [];
    this.lastHit = null;
    this.hitDirection = null;
  }

  async makeMove(opponent, opponentBoard) {
    let row, col;

    if (this.mode === 'target' && this.targetQueue.length > 0) {
      ({ row, col } = this.targetQueue.shift());
    } else {
      this.mode = 'hunt';
      ({ row, col } = this.huntMove(opponentBoard));
    }

    const result = this.processMove(opponent, opponentBoard, row, col);
    
    if (result.hit) {
      this.handleHit(row, col, result.sunk, opponentBoard);
    } else {
      this.handleMiss();
    }

    return {
      row,
      col,
      ...result,
      message: `CPU ${result.hit ? 'HIT' : 'MISS'} at ${row}${col}. ${result.message}`
    };
  }

  huntMove(board) {
    const availablePositions = board.getAvailablePositions();
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }

  processMove(opponent, opponentBoard, row, col) {
    opponentBoard.markGuess(row, col);
    
    const hitShip = opponent.getShipAt(row, col);
    
    if (hitShip && !hitShip.isHit(row, col)) {
      hitShip.hit(row, col);
      opponentBoard.markHit(row, col);
      
      if (hitShip.isSunk()) {
        opponent.shipsRemaining--;
        return { 
          hit: true, 
          sunk: true, 
          message: `Ship sunk! ${opponent.shipsRemaining} ships remaining.` 
        };
      }
      
      return { hit: true, sunk: false, message: 'Hit!' };
    } else {
      opponentBoard.markMiss(row, col);
      return { hit: false, sunk: false, message: 'Miss.' };
    }
  }

  handleHit(row, col, sunk, board) {
    this.lastHit = { row, col };
    
    if (sunk) {
      // Reset to hunt mode when ship is sunk
      this.mode = 'hunt';
      this.targetQueue = [];
      this.hitDirection = null;
    } else {
      // Switch to target mode and add adjacent positions
      this.mode = 'target';
      this.addAdjacentTargets(row, col, board);
    }
  }

  handleMiss() {
    if (this.mode === 'target' && this.targetQueue.length === 0) {
      this.mode = 'hunt';
    }
  }

  addAdjacentTargets(row, col, board) {
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }   // right
    ];

    directions.forEach(dir => {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      if (board.isValidPosition(newRow, newCol) && !board.isGuessed(newRow, newCol)) {
        const target = { row: newRow, col: newCol };
        if (!this.targetQueue.some(t => t.row === target.row && t.col === target.col)) {
          this.targetQueue.push(target);
        }
      }
    });
  }

  reset() {
    this.mode = 'hunt';
    this.targetQueue = [];
    this.lastHit = null;
    this.hitDirection = null;
  }
} 