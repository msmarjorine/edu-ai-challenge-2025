import { InputValidator } from './InputValidator.js';

describe('InputValidator', () => {
  describe('validateCoordinates', () => {
    const boardSize = 10;

    test('should validate correct coordinates', () => {
      const result = InputValidator.validateCoordinates('00', boardSize);
      expect(result.isValid).toBe(true);
      expect(result.row).toBe(0);
      expect(result.col).toBe(0);
    });

    test('should validate coordinates within bounds', () => {
      const result1 = InputValidator.validateCoordinates('99', boardSize);
      expect(result1.isValid).toBe(true);
      expect(result1.row).toBe(9);
      expect(result1.col).toBe(9);

      const result2 = InputValidator.validateCoordinates('45', boardSize);
      expect(result2.isValid).toBe(true);
      expect(result2.row).toBe(4);
      expect(result2.col).toBe(5);
    });

    test('should reject null or undefined input', () => {
      const result1 = InputValidator.validateCoordinates(null, boardSize);
      expect(result1.isValid).toBe(false);
      expect(result1.message).toContain('Input must be a string');

      const result2 = InputValidator.validateCoordinates(undefined, boardSize);
      expect(result2.isValid).toBe(false);
      expect(result2.message).toContain('Input must be a string');
    });

    test('should reject non-string input', () => {
      const result = InputValidator.validateCoordinates(123, boardSize);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Input must be a string');
    });

    test('should reject input with wrong length', () => {
      const result1 = InputValidator.validateCoordinates('1', boardSize);
      expect(result1.isValid).toBe(false);
      expect(result1.message).toContain('exactly two digits');

      const result2 = InputValidator.validateCoordinates('123', boardSize);
      expect(result2.isValid).toBe(false);
      expect(result2.message).toContain('exactly two digits');
    });

    test('should reject non-numeric input', () => {
      const result1 = InputValidator.validateCoordinates('ab', boardSize);
      expect(result1.isValid).toBe(false);
      expect(result1.message).toContain('numeric digits');

      const result2 = InputValidator.validateCoordinates('1a', boardSize);
      expect(result2.isValid).toBe(false);
      expect(result2.message).toContain('numeric digits');
    });

    test('should reject coordinates out of bounds', () => {
      const result1 = InputValidator.validateCoordinates('aa', boardSize);
      expect(result1.isValid).toBe(false);

      const result2 = InputValidator.validateCoordinates('99', 5);
      expect(result2.isValid).toBe(false);
      expect(result2.message).toContain('between 0 and 4');
    });

    test('should handle whitespace in input', () => {
      const result = InputValidator.validateCoordinates(' 12 ', boardSize);
      expect(result.isValid).toBe(true);
      expect(result.row).toBe(1);
      expect(result.col).toBe(2);
    });
  });

  describe('sanitizeInput', () => {
    test('should remove non-numeric characters', () => {
      expect(InputValidator.sanitizeInput('1a2b3')).toBe('123');
      expect(InputValidator.sanitizeInput('!@#45$%^')).toBe('45');
    });

    test('should handle empty strings', () => {
      expect(InputValidator.sanitizeInput('')).toBe('');
      expect(InputValidator.sanitizeInput('abc')).toBe('');
    });

    test('should handle non-string input', () => {
      expect(InputValidator.sanitizeInput(null)).toBe('');
      expect(InputValidator.sanitizeInput(undefined)).toBe('');
      expect(InputValidator.sanitizeInput(123)).toBe('');
    });

    test('should trim whitespace', () => {
      expect(InputValidator.sanitizeInput(' 123 ')).toBe('123');
    });
  });

  describe('isValidBoardSize', () => {
    test('should accept valid board sizes', () => {
      expect(InputValidator.isValidBoardSize(5)).toBe(true);
      expect(InputValidator.isValidBoardSize(10)).toBe(true);
      expect(InputValidator.isValidBoardSize(15)).toBe(true);
    });

    test('should reject invalid board sizes', () => {
      expect(InputValidator.isValidBoardSize(4)).toBe(false);
      expect(InputValidator.isValidBoardSize(16)).toBe(false);
      expect(InputValidator.isValidBoardSize(0)).toBe(false);
      expect(InputValidator.isValidBoardSize(-1)).toBe(false);
    });

    test('should reject non-integer values', () => {
      expect(InputValidator.isValidBoardSize(5.5)).toBe(false);
      expect(InputValidator.isValidBoardSize('10')).toBe(false);
      expect(InputValidator.isValidBoardSize(null)).toBe(false);
    });
  });

  describe('isValidShipCount', () => {
    test('should accept valid ship counts', () => {
      expect(InputValidator.isValidShipCount(1, 10)).toBe(true);
      expect(InputValidator.isValidShipCount(5, 10)).toBe(true);
      expect(InputValidator.isValidShipCount(10, 10)).toBe(true);
    });

    test('should reject invalid ship counts', () => {
      expect(InputValidator.isValidShipCount(0, 10)).toBe(false);
      expect(InputValidator.isValidShipCount(11, 10)).toBe(false);
      expect(InputValidator.isValidShipCount(-1, 10)).toBe(false);
    });
  });

  describe('isValidShipLength', () => {
    test('should accept valid ship lengths', () => {
      expect(InputValidator.isValidShipLength(2, 10)).toBe(true);
      expect(InputValidator.isValidShipLength(5, 10)).toBe(true);
      expect(InputValidator.isValidShipLength(10, 10)).toBe(true);
    });

    test('should reject invalid ship lengths', () => {
      expect(InputValidator.isValidShipLength(1, 10)).toBe(false);
      expect(InputValidator.isValidShipLength(11, 10)).toBe(false);
      expect(InputValidator.isValidShipLength(0, 10)).toBe(false);
    });
  });
}); 