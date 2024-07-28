package.json
npm i express | ws

index.js

import express from "express";
import {WebSocketServer} from "ws";

const app = express();
const port = 8000;

const server = app.listen(8000, ()=> {
  console.log("server is running")
});

const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("data from client: ", data);
    ws.send("thanks buddy");
  })
} )


