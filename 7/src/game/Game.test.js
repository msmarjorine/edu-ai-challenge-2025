import { Game } from './Game.js';
import { Ship } from './Ship.js';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = () => {};
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe('constructor', () => {
    test('should initialize game with proper components', () => {
      expect(game.config).toBeDefined();
      expect(game.playerBoard).toBeDefined();
      expect(game.cpuBoard).toBeDefined();
      expect(game.player).toBeDefined();
      expect(game.cpuPlayer).toBeDefined();
      expect(game.renderer).toBeDefined();
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBe(null);
    });
  });

  describe('generateRandomShip', () => {
    test('should generate a ship with correct length', () => {
      const ship = game.generateRandomShip();
      expect(ship).toBeInstanceOf(Ship);
      expect(ship.positions).toHaveLength(game.config.SHIP_LENGTH);
    });

    test('should generate ships within board boundaries', () => {
      for (let i = 0; i < 10; i++) {
        const ship = game.generateRandomShip();
        ship.positions.forEach(pos => {
          expect(pos.row).toBeGreaterThanOrEqual(0);
          expect(pos.row).toBeLessThan(game.config.BOARD_SIZE);
          expect(pos.col).toBeGreaterThanOrEqual(0);
          expect(pos.col).toBeLessThan(game.config.BOARD_SIZE);
        });
      }
    });
  });

  describe('canPlaceShip', () => {
    test('should return true for valid ship placement', () => {
      const ship = new Ship([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]);
      
      const canPlace = game.canPlaceShip(game.playerBoard, ship);
      expect(canPlace).toBe(true);
    });

    test('should return false for invalid ship placement', () => {
      // Place a ship first
      game.playerBoard.placeShip(0, 0);
      
      const overlappingShip = new Ship([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]);
      
      const canPlace = game.canPlaceShip(game.playerBoard, overlappingShip);
      expect(canPlace).toBe(false);
    });
  });

  describe('placeShip', () => {
    test('should place ship on board', () => {
      const ship = new Ship([
        { row: 0, col: 0 },
        { row: 0, col: 1 }
      ]);
      
      game.placeShip(game.playerBoard, ship);
      
      expect(game.playerBoard.getCell(0, 0)).toBe('S');
      expect(game.playerBoard.getCell(0, 1)).toBe('S');
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      const ship = new Ship([{ row: 5, col: 5 }, { row: 5, col: 6 }]);
      game.cpuPlayer.addShip(ship);
    });

    test('should process hit correctly', () => {
      const result = game.processGuess(game.cpuPlayer, game.cpuBoard, 5, 5);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Hit!');
    });

    test('should process miss correctly', () => {
      const result = game.processGuess(game.cpuPlayer, game.cpuBoard, 0, 0);
      
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Miss.');
    });

    test('should detect sunk ship', () => {
      game.processGuess(game.cpuPlayer, game.cpuBoard, 5, 5);
      const result = game.processGuess(game.cpuPlayer, game.cpuBoard, 5, 6);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(result.message).toContain('Ship sunk!');
    });
  });

  describe('checkGameOver', () => {
    test('should return false when both players have ships', () => {
      game.player.shipsRemaining = 3;
      game.cpuPlayer.shipsRemaining = 3;
      
      const gameOver = game.checkGameOver();
      expect(gameOver).toBe(false);
      expect(game.isGameOver).toBe(false);
    });

    test('should return true when player has no ships', () => {
      game.player.shipsRemaining = 0;
      game.cpuPlayer.shipsRemaining = 2;
      
      const gameOver = game.checkGameOver();
      expect(gameOver).toBe(true);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.cpuPlayer);
    });

    test('should return true when CPU has no ships', () => {
      game.player.shipsRemaining = 2;
      game.cpuPlayer.shipsRemaining = 0;
      
      const gameOver = game.checkGameOver();
      expect(gameOver).toBe(true);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.player);
    });
  });

  describe('getGameState', () => {
    test('should return game state object', () => {
      const gameState = game.getGameState();
      
      expect(gameState).toHaveProperty('playerBoard');
      expect(gameState).toHaveProperty('opponentBoard');
      expect(gameState).toHaveProperty('isGameOver');
      expect(gameState).toHaveProperty('winner');
      expect(gameState).toHaveProperty('playerShipsRemaining');
      expect(gameState).toHaveProperty('cpuShipsRemaining');
    });
  });
}); 