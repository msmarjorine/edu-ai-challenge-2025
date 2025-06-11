export class GameConfig {
  constructor() {
    this.BOARD_SIZE = 10;
    this.NUM_SHIPS = 3;
    this.SHIP_LENGTH = 3;
    this.WATER_SYMBOL = '~';
    this.SHIP_SYMBOL = 'S';
    this.HIT_SYMBOL = 'X';
    this.MISS_SYMBOL = 'O';
  }

  static get DEFAULT() {
    return new GameConfig();
  }

  validate() {
    const errors = [];
    
    if (this.BOARD_SIZE < 5 || this.BOARD_SIZE > 15) {
      errors.push('Board size must be between 5 and 15');
    }
    
    if (this.NUM_SHIPS < 1 || this.NUM_SHIPS > 10) {
      errors.push('Number of ships must be between 1 and 10');
    }
    
    if (this.SHIP_LENGTH < 2 || this.SHIP_LENGTH > this.BOARD_SIZE) {
      errors.push('Ship length must be between 2 and board size');
    }
    
    // Check if ships can fit on board
    const minSpaceNeeded = this.NUM_SHIPS * this.SHIP_LENGTH;
    const availableSpace = this.BOARD_SIZE * this.BOARD_SIZE;
    
    if (minSpaceNeeded > availableSpace * 0.7) {
      errors.push('Too many ships for the board size');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  clone() {
    const config = new GameConfig();
    config.BOARD_SIZE = this.BOARD_SIZE;
    config.NUM_SHIPS = this.NUM_SHIPS;
    config.SHIP_LENGTH = this.SHIP_LENGTH;
    return config;
  }
} 