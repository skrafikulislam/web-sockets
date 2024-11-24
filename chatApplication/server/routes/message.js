import express from "express";
import authVerify from "../middlewares/auth.js";
import ConversationModel from "../models/Conversation.js";
import ChatModel from "../models/ChatModel.js";
import { GetReceiverSocketId, io } from "../socket/socket.js";

const route = express.Router();

route.get("/read/:receiverId", authVerify, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(404).json({ message: "No Data" });
    }
    const chats = await ChatModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error on message route for fetching messages :" + error);
  }
});

route.post("/send/:receiverId", authVerify, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;
    const { content } = req.body;

    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new ConversationModel({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }
    const chat = new ChatModel({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content: content,
      createdAt: new Date(),
    });
    await chat.save();

    //? to get live real time chatting messages
    const receiverSocketId = GetReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", chat);
    }

    res.status(200).json({
      message: "Message sent successfully and save in database",
      chat,
    });
  } catch (error) {
    console.log("Error on message route and controller " + error);
  }
});

export default route;
