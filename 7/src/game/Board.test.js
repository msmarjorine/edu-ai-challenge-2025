import { Board } from './Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  describe('constructor', () => {
    test('should initialize board with correct size', () => {
      expect(board.size).toBe(10);
      expect(board.grid).toHaveLength(10);
      expect(board.grid[0]).toHaveLength(10);
    });

    test('should initialize grid with water symbols', () => {
      for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
          expect(board.grid[row][col]).toBe('~');
        }
      }
    });

    test('should initialize empty guesses set', () => {
      expect(board.guesses.size).toBe(0);
    });
  });

  describe('isValidPosition', () => {
    test('should return true for valid positions', () => {
      expect(board.isValidPosition(0, 0)).toBe(true);
      expect(board.isValidPosition(5, 5)).toBe(true);
      expect(board.isValidPosition(9, 9)).toBe(true);
    });

    test('should return false for invalid positions', () => {
      expect(board.isValidPosition(-1, 0)).toBe(false);
      expect(board.isValidPosition(0, -1)).toBe(false);
      expect(board.isValidPosition(10, 0)).toBe(false);
      expect(board.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    test('should return true for empty water cells', () => {
      expect(board.isEmpty(0, 0)).toBe(true);
      expect(board.isEmpty(5, 5)).toBe(true);
    });

    test('should return false after placing ship', () => {
      board.placeShip(0, 0);
      expect(board.isEmpty(0, 0)).toBe(false);
    });

    test('should return false for invalid positions', () => {
      expect(board.isEmpty(-1, 0)).toBe(false);
      expect(board.isEmpty(10, 0)).toBe(false);
    });
  });

  describe('placeShip', () => {
    test('should place ship symbol on valid position', () => {
      board.placeShip(0, 0);
      expect(board.grid[0][0]).toBe('S');
    });

    test('should not change invalid positions', () => {
      const originalGrid = board.grid.map(row => [...row]);
      board.placeShip(-1, 0);
      expect(board.grid).toEqual(originalGrid);
    });
  });

  describe('markGuess and isGuessed', () => {
    test('should mark and track guesses', () => {
      expect(board.isGuessed(0, 0)).toBe(false);
      
      board.markGuess(0, 0);
      expect(board.isGuessed(0, 0)).toBe(true);
    });

    test('should handle multiple guesses', () => {
      board.markGuess(0, 0);
      board.markGuess(1, 1);
      board.markGuess(9, 9);
      
      expect(board.isGuessed(0, 0)).toBe(true);
      expect(board.isGuessed(1, 1)).toBe(true);
      expect(board.isGuessed(9, 9)).toBe(true);
      expect(board.isGuessed(5, 5)).toBe(false);
    });
  });

  describe('markHit', () => {
    test('should mark hit on valid position', () => {
      board.markHit(0, 0);
      expect(board.grid[0][0]).toBe('X');
    });
  });

  describe('markMiss', () => {
    test('should mark miss on valid position', () => {
      board.markMiss(0, 0);
      expect(board.grid[0][0]).toBe('O');
    });
  });

  describe('getCell', () => {
    test('should return cell value for valid positions', () => {
      expect(board.getCell(0, 0)).toBe('~');
      
      board.placeShip(0, 0);
      expect(board.getCell(0, 0)).toBe('S');
    });

    test('should return null for invalid positions', () => {
      expect(board.getCell(-1, 0)).toBe(null);
      expect(board.getCell(10, 0)).toBe(null);
    });
  });

  describe('getDisplayBoard', () => {
    beforeEach(() => {
      board.placeShip(0, 0);
      board.markHit(1, 1);
      board.markMiss(2, 2);
    });

    test('should show ships when showShips is true', () => {
      const displayBoard = board.getDisplayBoard(true);
      expect(displayBoard[0][0]).toBe('S');
      expect(displayBoard[1][1]).toBe('X');
      expect(displayBoard[2][2]).toBe('O');
    });

    test('should hide ships when showShips is false', () => {
      const displayBoard = board.getDisplayBoard(false);
      expect(displayBoard[0][0]).toBe('~');
      expect(displayBoard[1][1]).toBe('X');
      expect(displayBoard[2][2]).toBe('O');
    });
  });

  describe('getAvailablePositions', () => {
    test('should return all positions when no guesses made', () => {
      const positions = board.getAvailablePositions();
      expect(positions).toHaveLength(100);
    });

    test('should exclude guessed positions', () => {
      board.markGuess(0, 0);
      board.markGuess(1, 1);
      
      const positions = board.getAvailablePositions();
      expect(positions).toHaveLength(98);
      expect(positions).not.toContainEqual({ row: 0, col: 0 });
      expect(positions).not.toContainEqual({ row: 1, col: 1 });
    });
  });

  describe('reset', () => {
    test('should reset board to initial state', () => {
      board.placeShip(0, 0);
      board.markGuess(1, 1);
      board.markHit(2, 2);
      
      board.reset();
      
      expect(board.grid[0][0]).toBe('~');
      expect(board.grid[2][2]).toBe('~');
      expect(board.isGuessed(1, 1)).toBe(false);
      expect(board.guesses.size).toBe(0);
    });
  });
}); 