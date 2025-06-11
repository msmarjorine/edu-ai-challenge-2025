export class InputValidator {
  static validateCoordinates(input, boardSize) {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        message: 'Input must be a string (e.g., "00", "34", "98")'
      };
    }

    const trimmedInput = input.trim();
    
    if (trimmedInput.length !== 2) {
      return {
        isValid: false,
        message: 'Input must be exactly two digits (e.g., "00", "34", "98")'
      };
    }

    const row = parseInt(trimmedInput[0]);
    const col = parseInt(trimmedInput[1]);

    if (isNaN(row) || isNaN(col)) {
      return {
        isValid: false,
        message: 'Input must contain only numeric digits'
      };
    }

    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
      return {
        isValid: false,
        message: `Coordinates must be between 0 and ${boardSize - 1}`
      };
    }

    return {
      isValid: true,
      row,
      col
    };
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
    return input.trim().replace(/[^0-9]/g, '');
  }

  static isValidBoardSize(size) {
    return Number.isInteger(size) && size >= 5 && size <= 15;
  }

  static isValidShipCount(count, boardSize) {
    return Number.isInteger(count) && count >= 1 && count <= boardSize;
  }

  static isValidShipLength(length, boardSize) {
    return Number.isInteger(length) && length >= 2 && length <= boardSize;
  }
} 