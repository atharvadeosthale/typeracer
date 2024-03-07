import { Server } from "socket.io";
import { Game } from "./classes/game";

export const rooms = new Map<string, Game>();

export function setupListeners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`New connection - ${socket.id}`);

    socket.on("join-game", (roomId: string, name: string) => {
      if (!roomId) {
        return socket.emit("error", "Invalid room ID");
      }
      socket.join(roomId);
      console.log("joined a room");

      // Check if the game already exists
      if (rooms.has(roomId)) {
        console.log("room exists");
        // Add the player to the class instance
        const game = rooms.get(roomId);
        if (!game) return socket.emit("error", "Game not found");
        game.joinPlayer(socket.id, name, socket);
      } else {
        console.log("room doesnt exists");
        // Create a new game instance
        const game = new Game(roomId, io, socket.id);
        rooms.set(roomId, game);
        game.joinPlayer(socket.id, name, socket);
      }
    });
  });
}
