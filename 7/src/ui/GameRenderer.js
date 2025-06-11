export class GameRenderer {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
      magenta: '\x1b[35m'
    };
  }

  renderBoards(gameState) {
    const { playerBoard, opponentBoard } = gameState;
    const size = playerBoard.length;
    
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Header row
    let header = '  ';
    for (let i = 0; i < size; i++) {
      header += i + ' ';
    }
    console.log(header + '     ' + header);

    // Board rows
    for (let row = 0; row < size; row++) {
      let rowStr = row + ' ';
      
      // Opponent board row
      for (let col = 0; col < size; col++) {
        const cell = opponentBoard[row][col];
        rowStr += this.colorizeCell(cell, false) + ' ';
      }
      
      rowStr += '    ' + row + ' ';
      
      // Player board row
      for (let col = 0; col < size; col++) {
        const cell = playerBoard[row][col];
        rowStr += this.colorizeCell(cell, true) + ' ';
      }
      
      console.log(rowStr);
    }
    
    console.log('\n');
    this.renderGameInfo(gameState);
  }

  colorizeCell(cell, isPlayerBoard) {
    switch (cell) {
      case 'S':
        return this.colors.green + cell + this.colors.reset;
      case 'X':
        return this.colors.red + cell + this.colors.reset;
      case 'O':
        return this.colors.blue + cell + this.colors.reset;
      case '~':
      default:
        return this.colors.cyan + cell + this.colors.reset;
    }
  }

  renderGameInfo(gameState) {
    console.log(`Player Ships Remaining: ${this.colors.green}${gameState.playerShipsRemaining}${this.colors.reset}`);
    console.log(`CPU Ships Remaining: ${this.colors.red}${gameState.cpuShipsRemaining}${this.colors.reset}`);
    
    if (gameState.isGameOver) {
      this.renderGameOver(gameState.winner);
    }
  }

  renderGameOver(winner) {
    console.log('\n' + '='.repeat(50));
    if (winner === 'Human') {
      console.log(this.colors.green + '*** CONGRATULATIONS! You won! ***' + this.colors.reset);
    } else {
      console.log(this.colors.red + '*** GAME OVER! CPU won! ***' + this.colors.reset);
    }
    console.log('='.repeat(50) + '\n');
  }

  renderWelcome() {
    console.log(this.colors.magenta + '='.repeat(40) + this.colors.reset);
    console.log(this.colors.magenta + '         SEA BATTLE GAME' + this.colors.reset);
    console.log(this.colors.magenta + '='.repeat(40) + this.colors.reset);
    console.log('\nLegend:');
    console.log(`${this.colors.cyan}~${this.colors.reset} = Water (unknown)`);
    console.log(`${this.colors.green}S${this.colors.reset} = Your ship`);
    console.log(`${this.colors.red}X${this.colors.reset} = Hit`);
    console.log(`${this.colors.blue}O${this.colors.reset} = Miss`);
    console.log('');
  }

  renderError(message) {
    console.log(this.colors.red + '❌ ' + message + this.colors.reset);
  }

  renderSuccess(message) {
    console.log(this.colors.green + '✅ ' + message + this.colors.reset);
  }

  renderInfo(message) {
    console.log(this.colors.yellow + 'ℹ️  ' + message + this.colors.reset);
  }

  renderPrompt(message) {
    return this.colors.cyan + message + this.colors.reset;
  }

  clearScreen() {
    console.clear();
  }
} 