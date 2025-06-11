import { Player } from './Player.js';
import { Board } from './Board.js';
import { Ship } from './Ship.js';

describe('Player', () => {
  let player;
  let board;

  beforeEach(() => {
    board = new Board(10);
    player = new Player('TestPlayer', board);
  });

  describe('constructor', () => {
    test('should initialize player with name and board', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.board).toBe(board);
      expect(player.ships).toEqual([]);
      expect(player.shipsRemaining).toBe(0);
    });
  });

  describe('addShip', () => {
    test('should add ship to player', () => {
      const ship = new Ship([{ row: 0, col: 0 }]);
      player.addShip(ship);
      
      expect(player.ships).toContain(ship);
      expect(player.shipsRemaining).toBe(1);
    });

    test('should add multiple ships', () => {
      const ship1 = new Ship([{ row: 0, col: 0 }]);
      const ship2 = new Ship([{ row: 1, col: 1 }]);
      
      player.addShip(ship1);
      player.addShip(ship2);
      
      expect(player.ships).toHaveLength(2);
      expect(player.shipsRemaining).toBe(2);
    });
  });

  describe('removeShip', () => {
    test('should remove ship from player', () => {
      const ship = new Ship([{ row: 0, col: 0 }]);
      player.addShip(ship);
      
      player.removeShip(ship);
      
      expect(player.ships).not.toContain(ship);
      expect(player.shipsRemaining).toBe(0);
    });

    test('should handle removing non-existent ship', () => {
      const ship1 = new Ship([{ row: 0, col: 0 }]);
      const ship2 = new Ship([{ row: 1, col: 1 }]);
      
      player.addShip(ship1);
      player.removeShip(ship2);
      
      expect(player.ships).toContain(ship1);
      expect(player.shipsRemaining).toBe(1);
    });
  });

  describe('hasShipsRemaining', () => {
    test('should return false when no ships', () => {
      expect(player.hasShipsRemaining()).toBe(false);
    });

    test('should return true when ships remaining', () => {
      const ship = new Ship([{ row: 0, col: 0 }]);
      player.addShip(ship);
      
      expect(player.hasShipsRemaining()).toBe(true);
    });
  });

  describe('getShipAt', () => {
    test('should return ship at position', () => {
      const ship = new Ship([{ row: 0, col: 0 }, { row: 0, col: 1 }]);
      player.addShip(ship);
      
      expect(player.getShipAt(0, 0)).toBe(ship);
      expect(player.getShipAt(0, 1)).toBe(ship);
    });

    test('should return undefined when no ship at position', () => {
      const ship = new Ship([{ row: 0, col: 0 }]);
      player.addShip(ship);
      
      expect(player.getShipAt(1, 1)).toBeUndefined();
    });
  });

  describe('getAllShipPositions', () => {
    test('should return all ship positions', () => {
      const ship1 = new Ship([{ row: 0, col: 0 }, { row: 0, col: 1 }]);
      const ship2 = new Ship([{ row: 2, col: 2 }]);
      
      player.addShip(ship1);
      player.addShip(ship2);
      
      const positions = player.getAllShipPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions).toContainEqual({ row: 0, col: 0, ship: ship1 });
      expect(positions).toContainEqual({ row: 0, col: 1, ship: ship1 });
      expect(positions).toContainEqual({ row: 2, col: 2, ship: ship2 });
    });

    test('should return empty array when no ships', () => {
      const positions = player.getAllShipPositions();
      expect(positions).toEqual([]);
    });
  });

  describe('getSunkShips', () => {
    test('should return only sunk ships', () => {
      const ship1 = new Ship([{ row: 0, col: 0 }]);
      const ship2 = new Ship([{ row: 1, col: 1 }]);
      
      player.addShip(ship1);
      player.addShip(ship2);
      
      // Sink ship1
      ship1.hit(0, 0);
      
      const sunkShips = player.getSunkShips();
      
      expect(sunkShips).toContain(ship1);
      expect(sunkShips).not.toContain(ship2);
    });
  });

  describe('getActiveShips', () => {
    test('should return only active (non-sunk) ships', () => {
      const ship1 = new Ship([{ row: 0, col: 0 }]);
      const ship2 = new Ship([{ row: 1, col: 1 }]);
      
      player.addShip(ship1);
      player.addShip(ship2);
      
      // Sink ship1
      ship1.hit(0, 0);
      
      const activeShips = player.getActiveShips();
      
      expect(activeShips).not.toContain(ship1);
      expect(activeShips).toContain(ship2);
    });
  });
}); 