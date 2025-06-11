import { CPUPlayer } from './CPUPlayer.js';
import { Player } from './Player.js';
import { Board } from './Board.js';
import { Ship } from './Ship.js';

describe('CPUPlayer', () => {
  let cpuPlayer;
  let opponent;
  let cpuBoard;
  let opponentBoard;

  beforeEach(() => {
    cpuBoard = new Board(10);
    opponentBoard = new Board(10);
    cpuPlayer = new CPUPlayer('CPU', cpuBoard);
    opponent = new Player('Human', opponentBoard);
  });

  describe('constructor', () => {
    test('should initialize CPU player with AI properties', () => {
      expect(cpuPlayer.name).toBe('CPU');
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBe(null);
      expect(cpuPlayer.hitDirection).toBe(null);
    });
  });

  describe('huntMove', () => {
    test('should return a valid position', () => {
      const move = cpuPlayer.huntMove(opponentBoard);
      
      expect(move).toHaveProperty('row');
      expect(move).toHaveProperty('col');
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThan(10);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThan(10);
    });

    test('should not return already guessed positions', () => {
      // Mark most positions as guessed
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
          opponentBoard.markGuess(i, j);
        }
      }
      
      const move = cpuPlayer.huntMove(opponentBoard);
      expect(opponentBoard.isGuessed(move.row, move.col)).toBe(false);
    });
  });

  describe('processMove', () => {
    beforeEach(() => {
      // Add a ship to opponent
      const ship = new Ship([{ row: 5, col: 5 }, { row: 5, col: 6 }]);
      opponent.addShip(ship);
    });

    test('should process hit correctly', () => {
      const result = cpuPlayer.processMove(opponent, opponentBoard, 5, 5);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Hit!');
      expect(opponentBoard.getCell(5, 5)).toBe('X');
    });

    test('should process miss correctly', () => {
      const result = cpuPlayer.processMove(opponent, opponentBoard, 0, 0);
      
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Miss.');
      expect(opponentBoard.getCell(0, 0)).toBe('O');
    });

    test('should detect sunk ship', () => {
      // Hit both positions of the ship
      cpuPlayer.processMove(opponent, opponentBoard, 5, 5);
      const result = cpuPlayer.processMove(opponent, opponentBoard, 5, 6);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(result.message).toContain('Ship sunk!');
      expect(opponent.shipsRemaining).toBe(0);
    });
  });

  describe('handleHit', () => {
    test('should switch to target mode on hit', () => {
      cpuPlayer.handleHit(5, 5, false, opponentBoard);
      
      expect(cpuPlayer.mode).toBe('target');
      expect(cpuPlayer.lastHit).toEqual({ row: 5, col: 5 });
      expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
    });

    test('should switch to hunt mode when ship is sunk', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [{ row: 3, col: 3 }];
      
      cpuPlayer.handleHit(5, 5, true, opponentBoard);
      
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.hitDirection).toBe(null);
    });
  });

  describe('handleMiss', () => {
    test('should switch to hunt mode when target queue is empty', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [];
      
      cpuPlayer.handleMiss();
      
      expect(cpuPlayer.mode).toBe('hunt');
    });

    test('should stay in target mode when queue has targets', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [{ row: 3, col: 3 }];
      
      cpuPlayer.handleMiss();
      
      expect(cpuPlayer.mode).toBe('target');
    });
  });

  describe('addAdjacentTargets', () => {
    test('should add valid adjacent positions to target queue', () => {
      cpuPlayer.addAdjacentTargets(5, 5, opponentBoard);
      
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 4, col: 5 });
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 6, col: 5 });
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 5, col: 4 });
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 5, col: 6 });
    });

    test('should not add positions outside board boundaries', () => {
      cpuPlayer.addAdjacentTargets(0, 0, opponentBoard);
      
      const invalidPositions = cpuPlayer.targetQueue.filter(pos => 
        pos.row < 0 || pos.col < 0 || pos.row >= 10 || pos.col >= 10
      );
      
      expect(invalidPositions).toHaveLength(0);
    });

    test('should not add already guessed positions', () => {
      opponentBoard.markGuess(4, 5);
      opponentBoard.markGuess(6, 5);
      
      cpuPlayer.addAdjacentTargets(5, 5, opponentBoard);
      
      expect(cpuPlayer.targetQueue).not.toContainEqual({ row: 4, col: 5 });
      expect(cpuPlayer.targetQueue).not.toContainEqual({ row: 6, col: 5 });
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 5, col: 4 });
      expect(cpuPlayer.targetQueue).toContainEqual({ row: 5, col: 6 });
    });
  });

  describe('reset', () => {
    test('should reset CPU player to initial state', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [{ row: 3, col: 3 }];
      cpuPlayer.lastHit = { row: 5, col: 5 };
      cpuPlayer.hitDirection = 'up';
      
      cpuPlayer.reset();
      
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBe(null);
      expect(cpuPlayer.hitDirection).toBe(null);
    });
  });

  describe('makeMove integration', () => {
    test('should use hunt mode when no targets', async () => {
      const ship = new Ship([{ row: 5, col: 5 }]);
      opponent.addShip(ship);
      
      const result = await cpuPlayer.makeMove(opponent, opponentBoard);
      
      expect(result).toHaveProperty('row');
      expect(result).toHaveProperty('col');
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('message');
    });

    test('should use target mode when targets available', async () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [{ row: 3, col: 3 }];
      
      const ship = new Ship([{ row: 3, col: 3 }]);
      opponent.addShip(ship);
      
      const result = await cpuPlayer.makeMove(opponent, opponentBoard);
      
      expect(result.row).toBe(3);
      expect(result.col).toBe(3);
      expect(result.hit).toBe(true);
    });
  });
}); 