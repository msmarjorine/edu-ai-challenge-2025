# 🚢 Sea Battle (Battleship) Game

A modernized command-line implementation of the classic Sea Battle (Battleship) game built with ES6+ JavaScript. Battle against an intelligent CPU opponent with strategic hunt-and-target AI!

## 🎮 Game Overview

Sea Battle is a strategic guessing game where you and the CPU opponent try to sink each other's ships by guessing coordinates on a 10×10 grid. The first player to sink all enemy ships wins!

### Key Features
- 🎯 **10×10 game board** with coordinate-based targeting
- 🤖 **Intelligent CPU opponent** with hunt and target modes
- 🌈 **Colorized console output** for better visual experience
- ⚡ **Modern ES6+ JavaScript** with modular architecture
- 🧪 **71%+ test coverage** ensuring reliability
- 🛡️ **Robust input validation** with helpful error messages

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14+ recommended)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Navigate to the game directory:**
   ```bash
   cd seabattle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the game:**
   ```bash
   npm start
   ```
   
   **Alternative:** You can also run directly with Node.js:
   ```bash
   node seabattle-modern.js
   ```

## 🎲 How to Play

### Game Setup
1. When you start the game, ships are automatically placed randomly on both your board and the CPU's board
2. The game displays two side-by-side boards:
   - **Left board**: Your view of the opponent's board (where you make guesses)
   - **Right board**: Your own board (shows your ships and where CPU has attacked)

### Making Your Move
1. **Enter coordinates** when prompted, using the format: `XY`
   - `X` = Row number (0-9)
   - `Y` = Column number (0-9)
   - Example: `34` targets row 3, column 4

2. **Valid coordinate examples:**
   - `00` - Top-left corner
   - `99` - Bottom-right corner
   - `45` - Row 4, Column 5
   - `72` - Row 7, Column 2

3. **Press Enter** to confirm your guess

### Game Flow
1. **Your Turn**: Enter coordinates to target the CPU's ships
2. **CPU Turn**: The CPU automatically makes its move using intelligent targeting
3. **Repeat** until one player sinks all enemy ships

## 📋 Game Symbols & Visual Guide

### Board Symbols
| Symbol | Meaning | Color |
|--------|---------|-------|
| `~` | Water (unknown/empty) | 🔵 Cyan |
| `S` | Your ship | 🟢 Green |
| `X` | Hit (ship damaged) | 🔴 Red |
| `O` | Miss (water hit) | 🔵 Blue |

### Sample Game Board
```
   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9        0 1 2 3 4 5 6 7 8 9 
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
1 ~ ~ X ~ ~ ~ ~ ~ ~ ~     1 ~ ~ ~ S S S ~ ~ ~ ~ 
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
3 ~ ~ ~ ~ O ~ ~ ~ ~ ~     3 ~ ~ ~ ~ ~ ~ ~ X ~ ~ 
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     5 S ~ ~ ~ ~ ~ ~ ~ ~ ~ 
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     6 S ~ ~ ~ ~ ~ ~ ~ ~ O 
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     7 S ~ ~ ~ ~ ~ ~ ~ ~ ~ 
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 

Player Ships Remaining: 3
CPU Ships Remaining: 2
```

## 🎯 Game Rules

### Ship Configuration
- **3 ships** per player
- **3 cells long** each ship
- Ships are placed **horizontally or vertically** (not diagonally)
- Ships **cannot overlap** or touch each other

### Winning Conditions
- **Victory**: Sink all 3 enemy ships (hit all positions of each ship)
- **Defeat**: All your ships are sunk by the CPU

### CPU AI Behavior
The CPU uses an intelligent two-mode strategy:

1. **🎯 Hunt Mode**: 
   - Randomly targets unexplored areas
   - Switches to Target Mode when a ship is hit

2. **🔍 Target Mode**:
   - Systematically targets adjacent cells around hits
   - Attempts to find and sink the entire ship
   - Returns to Hunt Mode when ship is completely sunk

## ⌨️ Input Guide

### Valid Input Format
- **Two digits**: Row number + Column number
- **Range**: Each digit must be 0-9
- **Examples**: `00`, `34`, `99`, `51`

### Invalid Input Examples
❌ `1` - Too short (need 2 digits)  
❌ `123` - Too long (only 2 digits allowed)  
❌ `ab` - Letters not allowed (numbers only)  
❌ `99` on a 5×5 board - Out of bounds  

### Error Handling
The game provides helpful error messages for invalid input:
- Format errors (wrong length, non-numeric)
- Boundary errors (coordinates outside board)
- Duplicate guesses (already tried that location)

## 🎮 Gameplay Tips

### Strategic Advice
1. **Spread your guesses** initially to find ships faster
2. **When you hit a ship**, target adjacent cells systematically
3. **Remember your misses** to avoid redundant guesses
4. **Watch the CPU's pattern** - it gets smarter after hitting your ships!

### Advanced Tactics
- **Checkerboard pattern**: Try alternating coordinates like a checkerboard for efficient hunting
- **Edge awareness**: Ships near board edges have fewer possible orientations
- **Count remaining ships**: Use the ship counter to track progress

## 🛠️ Technical Information

### Technology Stack
- **Node.js** with ES6+ modules
- **Modern JavaScript**: Classes, async/await, template literals
- **Jest** testing framework with 71%+ coverage
- **Modular architecture** with separation of concerns

### Project Structure
```
seabattle/
├── src/
│   ├── game/           # Core game logic
│   ├── utils/          # Utility functions  
│   └── ui/             # User interface
├── tests/              # Unit tests
├── package.json        # Dependencies & scripts
└── seabattle-modern.js # Main entry point
```

### Available Scripts
```bash
npm start          # Start the game
npm test           # Run unit tests
npm test:coverage  # Run tests with coverage report
npm test:watch     # Run tests in watch mode
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails  
**Solution**: Ensure Node.js 14+ is installed and try clearing npm cache

**Issue**: Game doesn't start  
**Solution**: Check that all dependencies are installed with `npm install`

**Issue**: Input not working  
**Solution**: Ensure you're entering exactly 2 digits (0-9) and pressing Enter

**Issue**: Colors not showing  
**Solution**: Use a modern terminal that supports ANSI color codes

### Getting Help
If you encounter issues:
1. Check this README for common solutions
2. Verify your Node.js version: `node --version`
3. Try reinstalling dependencies: `rm -rf node_modules && npm install`

## 🎊 Have Fun!

Enjoy playing Sea Battle! Test your strategy against the intelligent CPU opponent and see if you can master the art of naval warfare. Good luck, Admiral! ⚓

---

*This is a modernized version of the classic Battleship game, refactored from legacy code to modern ES6+ JavaScript with comprehensive testing and improved user experience.*
