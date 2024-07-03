export class Board {
    private grid: string[][];
  
    constructor() {
      this.grid = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
    }
  
    placeMarker(x: number, y: number, player: string): boolean {
      if (this.grid[x][y] === '') {
        this.grid[x][y] = player;
        return true;
      }
      return false;
    }
  
    isMoveValid(x: number, y: number): boolean {
      return this.grid[x][y] === '';
    }
  
    hasPlayerWon(player: string): boolean {
      for (let i = 0; i < 3; i++) {
        if (this.grid[i].every(cell => cell === player)) return true;
        if (this.grid.every(row => row[i] === player)) return true;
      }
      if (this.grid[0][0] === player && this.grid[1][1] === player && this.grid[2][2] === player) return true;
      if (this.grid[0][2] === player && this.grid[1][1] === player && this.grid[2][0] === player) return true;
      return false;
    }
  
    isFull(): boolean {
      return this.grid.every(row => row.every(cell => cell !== ''));
    }
  
    countEmptyCells(): number {
      return this.grid.reduce((count, row) => 
        count + row.filter(cell => cell === '').length, 0);
    }
  
    clear() {
      this.grid = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
    }
  }
  