export class Ship {
  constructor(positions) {
    this.positions = positions.map(pos => ({
      row: pos.row,
      col: pos.col,
      hit: false
    }));
    this.length = positions.length;
  }

  isHit(row, col) {
    const position = this.positions.find(pos => pos.row === row && pos.col === col);
    return position ? position.hit : false;
  }

  hit(row, col) {
    const position = this.positions.find(pos => pos.row === row && pos.col === col);
    if (position) {
      position.hit = true;
      return true;
    }
    return false;
  }

  isSunk() {
    return this.positions.every(pos => pos.hit);
  }

  getHitCount() {
    return this.positions.filter(pos => pos.hit).length;
  }

  containsPosition(row, col) {
    return this.positions.some(pos => pos.row === row && pos.col === col);
  }

  getUnhitPositions() {
    return this.positions.filter(pos => !pos.hit);
  }

  getHitPositions() {
    return this.positions.filter(pos => pos.hit);
  }
} 