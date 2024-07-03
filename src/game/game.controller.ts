import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('allRounds')
  fetchAllRounds() {
    return this.gameService.getAllRounds();
  }

  @Get('gameResults')
  fetchGameResults() {
    return this.gameService.getGameResults();
  }
}
