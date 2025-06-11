import { GameConfig } from './GameConfig.js';

describe('GameConfig', () => {
  let config;

  beforeEach(() => {
    config = new GameConfig();
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      expect(config.BOARD_SIZE).toBe(10);
      expect(config.NUM_SHIPS).toBe(3);
      expect(config.SHIP_LENGTH).toBe(3);
      expect(config.WATER_SYMBOL).toBe('~');
      expect(config.SHIP_SYMBOL).toBe('S');
      expect(config.HIT_SYMBOL).toBe('X');
      expect(config.MISS_SYMBOL).toBe('O');
    });
  });

  describe('DEFAULT static getter', () => {
    test('should return a new GameConfig instance', () => {
      const defaultConfig = GameConfig.DEFAULT;
      expect(defaultConfig).toBeInstanceOf(GameConfig);
      expect(defaultConfig.BOARD_SIZE).toBe(10);
    });
  });

  describe('validate', () => {
    test('should validate default configuration', () => {
      const result = config.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid board size', () => {
      config.BOARD_SIZE = 3;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Board size must be between 5 and 15');
    });

    test('should reject board size too large', () => {
      config.BOARD_SIZE = 20;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Board size must be between 5 and 15');
    });

    test('should reject invalid number of ships', () => {
      config.NUM_SHIPS = 0;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number of ships must be between 1 and 10');
    });

    test('should reject too many ships', () => {
      config.NUM_SHIPS = 15;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number of ships must be between 1 and 10');
    });

    test('should reject invalid ship length', () => {
      config.SHIP_LENGTH = 1;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Ship length must be between 2 and board size');
    });

    test('should reject ship length larger than board', () => {
      config.SHIP_LENGTH = 15;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Ship length must be between 2 and board size');
    });

    test('should reject too many ships for board space', () => {
      config.BOARD_SIZE = 5;
      config.NUM_SHIPS = 10;
      config.SHIP_LENGTH = 5;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Too many ships for the board size');
    });

    test('should collect multiple errors', () => {
      config.BOARD_SIZE = 3;
      config.NUM_SHIPS = 0;
      config.SHIP_LENGTH = 1;
      const result = config.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('clone', () => {
    test('should create a copy of the configuration', () => {
      config.BOARD_SIZE = 8;
      config.NUM_SHIPS = 5;
      config.SHIP_LENGTH = 4;

      const clone = config.clone();
      
      expect(clone).toBeInstanceOf(GameConfig);
      expect(clone.BOARD_SIZE).toBe(8);
      expect(clone.NUM_SHIPS).toBe(5);
      expect(clone.SHIP_LENGTH).toBe(4);
    });

    test('should create independent copy', () => {
      const clone = config.clone();
      clone.BOARD_SIZE = 15;
      
      expect(config.BOARD_SIZE).toBe(10);
      expect(clone.BOARD_SIZE).toBe(15);
    });
  });
}); 