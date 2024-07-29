import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;
const secret = "laiba";

// ? for creating the circuit instance

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("Hello woprld");
});

//? Creating route to use middleware with socket.io
app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "laiba" }, secret);
  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "You are logged in Sucess!",
    });
});

// ! Middleware In Socket Io using io.use((socket, next) => logic, next)

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    const token = socket.request.cookies.token;
    if (!token) return next(new Error("No token provided"));
    const decode = jwt.verify(token, secret);
    if (!decode) return next(new Error("Invalid token"));
    next();
  });
});

// ? First code to connnect socket io such as mongoose connection via url
io.on("connection", (socket) => {
  console.log("User Connected to Socket.Io backend log message", socket.id);

  //? The meesage coming from frontend client
  socket.on("message", ({ room, message }) => {
    console.log(room, message);
    //? Send the message to all the users connected
    //  socket.broadcast.emit("received-message", data);
    //? send the meesage only to the room connected
    //* if use <io.to()> the message will be sent to the sender himself as well
    socket.to(room).emit("received-message", message);
  });

  // ? For the Join Room Message
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User Joined Room Named : ${room} ${socket.id}`);
  });

  //? For Leave Room Message

  //? For Disconnect Socket
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

//? user server.listen because io is listening to sever
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
