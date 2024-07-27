const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
// ? Why http server is used here need to know
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);
  //? For Same Room User can exchange messages
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  //? For all users can share messages

  //!  socket.on("send_message", (data) => {
  //!   console.log(data);
  //!  socket.broadcast.emit("received_message", data);
  //! });

  //? sending mesage to all but with room user integration added extra
  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("received_message", data);
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));
