export class Player {
  constructor(name, board) {
    this.name = name;
    this.board = board;
    this.ships = [];
    this.shipsRemaining = 0;
  }

  addShip(ship) {
    this.ships.push(ship);
    this.shipsRemaining++;
  }

  removeShip(ship) {
    const index = this.ships.indexOf(ship);
    if (index > -1) {
      this.ships.splice(index, 1);
      this.shipsRemaining--;
    }
  }

  hasShipsRemaining() {
    return this.shipsRemaining > 0;
  }

  getShipAt(row, col) {
    return this.ships.find(ship => ship.containsPosition(row, col));
  }

  getAllShipPositions() {
    const positions = [];
    this.ships.forEach(ship => {
      ship.positions.forEach(pos => {
        positions.push({ row: pos.row, col: pos.col, ship });
      });
    });
    return positions;
  }

  getSunkShips() {
    return this.ships.filter(ship => ship.isSunk());
  }

  getActiveShips() {
    return this.ships.filter(ship => !ship.isSunk());
  }
} 