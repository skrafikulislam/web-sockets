// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

// MongoDB Message Model
// Message Model
const MessageSchema = new mongoose.Schema({
  sender: String, // Sender's username
  receiver: String, // Receiver's username
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// Server setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://babu:babu@cluster0.afv85q1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected To Database and listening to localhost:5000");
  })
  .catch((err) => {
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinChat", async ({ sender, receiver }) => {
    const room = [sender, receiver].sort().join("_");
    socket.join(room);

    try {
      const messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
        .sort({ timestamp: 1 })
        .exec();

      socket.emit("previousMessages", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;
    const room = [sender, receiver].sort().join("_");

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    io.to(room).emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
