import { Ship } from './Ship.js';

describe('Ship', () => {
  let ship;
  const positions = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 }
  ];

  beforeEach(() => {
    ship = new Ship(positions);
  });

  describe('constructor', () => {
    test('should initialize ship with correct positions', () => {
      expect(ship.positions).toHaveLength(3);
      expect(ship.length).toBe(3);
      
      ship.positions.forEach((pos, index) => {
        expect(pos.row).toBe(positions[index].row);
        expect(pos.col).toBe(positions[index].col);
        expect(pos.hit).toBe(false);
      });
    });

    test('should handle single position ship', () => {
      const singleShip = new Ship([{ row: 5, col: 5 }]);
      expect(singleShip.positions).toHaveLength(1);
      expect(singleShip.length).toBe(1);
    });
  });

  describe('containsPosition', () => {
    test('should return true for positions on ship', () => {
      expect(ship.containsPosition(0, 0)).toBe(true);
      expect(ship.containsPosition(0, 1)).toBe(true);
      expect(ship.containsPosition(0, 2)).toBe(true);
    });

    test('should return false for positions not on ship', () => {
      expect(ship.containsPosition(1, 0)).toBe(false);
      expect(ship.containsPosition(0, 3)).toBe(false);
      expect(ship.containsPosition(5, 5)).toBe(false);
    });
  });

  describe('hit', () => {
    test('should mark position as hit when position is on ship', () => {
      const result = ship.hit(0, 0);
      expect(result).toBe(true);
      expect(ship.positions[0].hit).toBe(true);
    });

    test('should return false when position is not on ship', () => {
      const result = ship.hit(1, 0);
      expect(result).toBe(false);
    });
  });

  describe('isSunk', () => {
    test('should return false when no positions are hit', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false when only some positions are hit', () => {
      ship.hit(0, 0);
      ship.hit(0, 1);
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true when all positions are hit', () => {
      ship.hit(0, 0);
      ship.hit(0, 1);
      ship.hit(0, 2);
      expect(ship.isSunk()).toBe(true);
    });
  });
}); 