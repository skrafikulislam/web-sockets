import express from "express";
import cors from "cors";
import dbConnection from "./dbConnection.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import messageRoute from "./routes/message.js";

import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

app.use(cors("*"));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/chat/user", authRoute);
app.use("/chat/users", userRoute);
app.use("/chat/message", messageRoute);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnection();
});
