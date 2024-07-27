import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:5000");

function App() {
  // ? Room state
  const [room, setRoom] = useState("");
  //? Messages State
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  // ? sendMesage Function is to share all users messages to each other
  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };
  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      {/* For specific room users share messages */}
      <input
        placeholder="Room Number"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      {/* ? For All Users to share messages */}
      <input
        placeholder="message here"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message is: {messageReceived} </h1>
    </div>
  );
}

export default App;
