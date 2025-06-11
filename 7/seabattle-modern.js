import readline from 'readline';
import { Game } from './src/game/Game.js';

class SeaBattleApp {
  constructor() {
    this.game = new Game();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    try {
      this.game.renderer.renderWelcome();
      await this.game.initialize();
      await this.gameLoop();
    } catch (error) {
      console.error('Game error:', error.message);
    } finally {
      this.rl.close();
    }
  }

  async gameLoop() {
    while (!this.game.isGameOver) {
      this.game.displayBoard();
      
      const guess = await this.getPlayerInput();
      const result = await this.game.playRound(guess);
      
      if (!result.success) {
        this.game.renderer.renderError(result.message);
        continue;
      }

      // Display player result
      if (result.result.hit) {
        this.game.renderer.renderSuccess(result.result.message);
      } else {
        this.game.renderer.renderInfo(result.result.message);
      }

      // Display CPU result if available
      if (result.cpuResult) {
        if (result.cpuResult.hit) {
          this.game.renderer.renderError(result.cpuResult.message);
        } else {
          this.game.renderer.renderInfo(result.cpuResult.message);
        }
      }

      // Check for game over
      if (result.gameOver) {
        this.game.displayBoard();
        break;
      }
    }
  }

  getPlayerInput() {
    return new Promise((resolve) => {
      this.rl.question(
        this.game.renderer.renderPrompt('Enter your guess (e.g., 00, 34, 99): '),
        (answer) => {
          resolve(answer);
        }
      );
    });
  }
}

// Start the game
const app = new SeaBattleApp();
app.start().catch(error => {
  console.error('Failed to start game:', error);
  process.exit(1);
}); 