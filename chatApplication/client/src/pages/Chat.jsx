import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Form from "../components/Form";

const Chat = ({ socket }) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [chats, setChats] = useState([]);
  const [receiverId, setReceiverId] = useState("");

  const loggedInUserId = localStorage.getItem("id");

  useEffect(() => {
    socket.emit("join", loggedInUserId);
  }, []);

  useEffect(() => {
    //? This is to prevent the message showing more than once in chat box

    const handleNewMessage = (msg) => {
        //? to prevent seeing other people's messages
      if (receiverId === msg.sender) {
        setChats((state) => [
          ...state,
          { sender: msg.sender, content: msg.content },
        ]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    //? clean up fn
    //? This is to prevent the message showing more than once in chat box

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, receiverId]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div
        className="bg-cover w-2/4 h-[calc(100vh-60px)] rounded-lg flex  "
        style={{
          backgroundImage: "url('/chat-bg.jpg')",
        }}
      >
        <Sidebar
          setChatStarted={setChatStarted}
          setChats={setChats}
          //   socket={socket}
          setReceiverId={setReceiverId}
        />

        <div className="w-3/4 bg-white flex flex-col bg-opacity-20 relative">
          {" "}
          {chatStarted ? (
            <>
              <div className="overflow-y-auto mb-20">
                {chats &&
                  chats.map((chat, i) => (
                    <div
                      key={i}
                      className={`flex px-4 ${
                        chat.sender === loggedInUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 my-2 rounded ${
                          chat.sender === loggedInUserId
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {chat.content}
                      </div>
                    </div>
                  ))}
                <Form
                  receiverId={receiverId}
                  setChats={setChats}
                  chats={chats}
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <h2 className="text-3xl py-3 bg-white bg-opacity-80 font-bold text-gray-700 rounded-lg ">
                Welcome User
              </h2>
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default Chat;
