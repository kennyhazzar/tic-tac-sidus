import { Injectable } from '@nestjs/common';
import { Board } from './board';

@Injectable()
export class GameService {
  private board: Board;
  private playerScores: Record<string, number>;
  private roundStats: any[];
  private gameStats: any[];

  constructor() {
    this.board = new Board();
    this.playerScores = { 'X': 0, 'O': 0 };
    this.roundStats = [];
    this.gameStats = [];
  }

  makeMove(x: number, y: number, player: string): { success: boolean, winner?: string } {
    if (this.board.placeMarker(x, y, player)) {
      const moveCount = this.calculateMoveCount();
      if (this.board.hasPlayerWon(player)) {
        this.playerScores[player]++;
        this.roundStats.push({
          winner: player,
          emptyCells: this.countEmptyCells(),
          moves: moveCount,
        });
        if (this.playerScores[player] === 2) {
          const gameWinner = player;
          this.gameStats.push({
            winner: gameWinner,
            [gameWinner]: this.playerScores[gameWinner],
          });
          this.resetMatch();
          return { success: true, winner: gameWinner };
        } else {
          this.board.clear();
        }
      } else if (this.board.isFull()) {
        this.roundStats.push({
          winner: 'draw',
          emptyCells: 0,
          moves: moveCount,
        });
        this.board.clear();
      }
      return { success: true };
    }
    return { success: false };
  }

  calculateMoveCount(): number {
    return 9 - this.countEmptyCells();
  }

  countEmptyCells(): number {
    return this.board.countEmptyCells();
  }

  getAllRounds() {
    return this.roundStats;
  }

  getGameResults() {
    return this.gameStats;
  }

  resetMatch() {
    this.board.clear();
    this.playerScores = { 'X': 0, 'O': 0 };
  }
}
