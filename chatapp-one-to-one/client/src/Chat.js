// src/Chat.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [username, setUsername] = useState("Shashank");
  const [activeChatUser, setActiveChatUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const users = ["Ravi", "Subhas"];

  useEffect(() => {
    if (activeChatUser) {
      socket.emit("joinChat", { sender: username, receiver: activeChatUser });

      socket.on("previousMessages", (chatHistory) => {
        setMessages(chatHistory);
      });

      socket.on("newMessage", (newMsg) => {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      });

      return () => {
        socket.off("previousMessages");
        socket.off("newMessage");
      };
    }
  }, [activeChatUser]);

  const sendMessage = () => {
    if (message && activeChatUser) {
      const newMessage = {
        sender: username,
        receiver: activeChatUser,
        message,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-row h-screen bg-gray-200 p-4">
      {/* Sidebar for user list */}
      <div className="w-1/4 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user}>
              <button
                onClick={() => setActiveChatUser(user)}
                className={`w-full text-left p-2 mb-2 rounded ${
                  activeChatUser === user
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {user}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      <div className="flex flex-col w-3/4 bg-white rounded-lg shadow-md p-4 ml-4">
        {activeChatUser ? (
          <>
            <h2 className="text-lg font-bold mb-4">
              Chat with {activeChatUser}
            </h2>
            <div className="flex flex-col space-y-2 overflow-y-auto h-80 mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    msg.sender === username ? "bg-blue-200" : "bg-gray-200"
                  }`}
                >
                  <strong>{msg.sender}</strong>: {msg.message}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="p-2 border border-gray-300 rounded w-full"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white p-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <h2 className="text-lg font-bold">Select a user to chat</h2>
        )}
      </div>
    </div>
  );
};

export default Chat;
