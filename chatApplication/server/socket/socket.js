import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();

const onlineUser = {};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

export const GetReceiverSocketId = (receiverId) => {
    return onlineUser[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected and id is: " + socket.id);

  socket.on("join", (receiverId) => {
    onlineUser[receiverId] = socket.id;
    console.log(
        "User " + receiverId + " joined and  the socket id is: " + socket.id
    );
    console.log(onlineUser);
    console.log(onlineUser[receiverId]);
  });
});

export { app, server, io };
