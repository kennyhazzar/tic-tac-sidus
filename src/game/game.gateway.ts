import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: { socket: Socket, player: string }[] = [];
  private currentPlayerIndex = 0;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    if (this.clients.length < 2) {
      const player = this.clients.length === 0 ? 'X' : 'O';
      this.clients.push({ socket: client, player });
      console.log(`Client connected: ${client.id} as Player ${player}`);

      if (this.clients.length === 2) {
        this.startGame();
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(c => c.socket.id !== client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  startGame() {
    this.server.emit('startGame');
    this.promptNextMove();
  }

  promptNextMove() {
    const client = this.clients[this.currentPlayerIndex];
    client.socket.emit('yourTurn', { player: client.player });
  }

  @SubscribeMessage('makeMove')
  handleMove(@MessageBody() data: { x: number, y: number, player: string }) {
    const client = this.clients[this.currentPlayerIndex];
    if (client.player !== data.player) {
      console.log(`Invalid move by ${data.player}. It's ${client.player}'s turn.`);
      return;
    }

    const result = this.gameService.makeMove(data.x, data.y, data.player);
    this.server.emit('moveMade', result);

    if (result.success && !result.winner) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
      this.promptNextMove();
    } else if (result.winner) {
      console.log(`Player ${result.winner} wins the game!`);
    }
  }
}
