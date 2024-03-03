import { Server } from "socket.io";
import { Game } from "./classes/game";

export const rooms = new Map<string, Game>();

export function setupListeners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`New connection - ${socket.id}`);

    io.on("join-channel", (roomId: string, name: string) => {
      if (!roomId) {
        socket.emit("error", "Invalid room ID");
      }
      socket.join(roomId);

      // Check if the game already exists
      if (rooms.has(roomId)) {
        // Add the player to the class instance
        const game = rooms.get(roomId);
        if (!game) return socket.emit("error", "Game not found");
        game.joinPlayer(socket.id, name, socket);
      } else {
        // Create a new game instance
        const game = new Game(roomId, io, socket.id);
        rooms.set(roomId, game);
        game.joinPlayer(socket.id, name, socket);
      }
    });
  });
}
