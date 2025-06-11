import { Board } from './Board.js';
import { Ship } from './Ship.js';
import { Player } from './Player.js';
import { CPUPlayer } from './CPUPlayer.js';
import { GameConfig } from './GameConfig.js';
import { InputValidator } from '../utils/InputValidator.js';
import { GameRenderer } from '../ui/GameRenderer.js';

export class Game {
  constructor() {
    this.config = new GameConfig();
    this.playerBoard = new Board(this.config.BOARD_SIZE);
    this.cpuBoard = new Board(this.config.BOARD_SIZE);
    this.player = new Player('Human', this.playerBoard);
    this.cpuPlayer = new CPUPlayer('CPU', this.cpuBoard);
    this.renderer = new GameRenderer();
    this.isGameOver = false;
    this.winner = null;
  }

  async initialize() {
    console.log('Initializing Sea Battle game...');
    
    // Place ships randomly for both players
    this.placeShipsRandomly(this.player);
    this.placeShipsRandomly(this.cpuPlayer);
    
    console.log("Let's play Sea Battle!");
    console.log(`Try to sink the ${this.config.NUM_SHIPS} enemy ships.`);
  }

  placeShipsRandomly(player) {
    const ships = [];
    let placedShips = 0;

    while (placedShips < this.config.NUM_SHIPS) {
      const ship = this.generateRandomShip();
      if (this.canPlaceShip(player.board, ship)) {
        this.placeShip(player.board, ship);
        ships.push(ship);
        placedShips++;
      }
    }

    player.ships = ships;
    player.shipsRemaining = this.config.NUM_SHIPS;
    console.log(`${this.config.NUM_SHIPS} ships placed randomly for ${player.name}.`);
  }

  generateRandomShip() {
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const size = this.config.BOARD_SIZE;
    const shipLength = this.config.SHIP_LENGTH;

    let startRow, startCol;
    if (orientation === 'horizontal') {
      startRow = Math.floor(Math.random() * size);
      startCol = Math.floor(Math.random() * (size - shipLength + 1));
    } else {
      startRow = Math.floor(Math.random() * (size - shipLength + 1));
      startCol = Math.floor(Math.random() * size);
    }

    const positions = [];
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      positions.push({ row, col });
    }

    return new Ship(positions);
  }

  canPlaceShip(board, ship) {
    return ship.positions.every(pos => 
      board.isValidPosition(pos.row, pos.col) && 
      board.isEmpty(pos.row, pos.col)
    );
  }

  placeShip(board, ship) {
    ship.positions.forEach(pos => {
      board.placeShip(pos.row, pos.col);
    });
  }

  async playRound(guess) {
    // Validate player input
    const validation = InputValidator.validateCoordinates(guess, this.config.BOARD_SIZE);
    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    const { row, col } = validation;
    
    // Check if already guessed
    if (this.cpuBoard.isGuessed(row, col)) {
      return { success: false, message: 'You already guessed that location!' };
    }

    // Process player's guess
    const playerResult = this.processGuess(this.cpuPlayer, this.cpuBoard, row, col);
    
    if (this.checkGameOver()) {
      return { success: true, result: playerResult, gameOver: true };
    }

    // CPU's turn
    const cpuResult = await this.cpuPlayer.makeMove(this.player, this.playerBoard);
    
    if (this.checkGameOver()) {
      return { success: true, result: playerResult, cpuResult, gameOver: true };
    }

    return { success: true, result: playerResult, cpuResult, gameOver: false };
  }

  processGuess(targetPlayer, targetBoard, row, col) {
    targetBoard.markGuess(row, col);
    
    // Check for hit
    const hitShip = targetPlayer.ships.find(ship => 
      ship.positions.some(pos => pos.row === row && pos.col === col && !pos.hit)
    );

    if (hitShip) {
      const hitPosition = hitShip.positions.find(pos => pos.row === row && pos.col === col);
      hitPosition.hit = true;
      targetBoard.markHit(row, col);

      const isSunk = hitShip.isSunk();
      if (isSunk) {
        targetPlayer.shipsRemaining--;
        return { hit: true, sunk: true, message: `Ship sunk! ${targetPlayer.shipsRemaining} ships remaining.` };
      }
      
      return { hit: true, sunk: false, message: 'Hit!' };
    } else {
      targetBoard.markMiss(row, col);
      return { hit: false, sunk: false, message: 'Miss.' };
    }
  }

  checkGameOver() {
    if (this.player.shipsRemaining === 0) {
      this.isGameOver = true;
      this.winner = this.cpuPlayer;
      return true;
    }
    
    if (this.cpuPlayer.shipsRemaining === 0) {
      this.isGameOver = true;
      this.winner = this.player;
      return true;
    }
    
    return false;
  }

  getGameState() {
    return {
      playerBoard: this.playerBoard.getDisplayBoard(true), // Show own ships
      opponentBoard: this.cpuBoard.getDisplayBoard(false), // Hide opponent ships
      isGameOver: this.isGameOver,
      winner: this.winner?.name,
      playerShipsRemaining: this.player.shipsRemaining,
      cpuShipsRemaining: this.cpuPlayer.shipsRemaining
    };
  }

  displayBoard() {
    this.renderer.renderBoards(this.getGameState());
  }
} 