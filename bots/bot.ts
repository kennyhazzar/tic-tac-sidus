import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

let player = '';

socket.on("connect", () => {
  console.log("Connected to game server");
});

socket.on("startGame", () => {
  console.log("Game started");
});

socket.on("yourTurn", ({ player: p }) => {
  if (player === '') {
    player = p;
  }
  if (player === p) {
    makeRandomMove();
  }
});

socket.on("moveMade", (data) => {
  if (data.winner) {
    console.log(`Player ${data.winner} wins the game!`);
    process.exit();
  }
});

function makeRandomMove() {
  const x = Math.floor(Math.random() * 3);
  const y = Math.floor(Math.random() * 3);
  console.log(`Making move at (${x}, ${y})`);
  socket.emit("makeMove", { x, y, player });
}
