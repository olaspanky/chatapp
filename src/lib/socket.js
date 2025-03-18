import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "https://spawn-nine.vercel.app"], // Allow frontend URLs
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  console.log("User ID received in handshake:", socket.handshake.query.userId);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Updated userSocketMap:", userSocketMap);
  } else {
    console.log("No userId received in handshake query!");
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});


export { io, app, server };
