import axios from "axios";
import React, { useState } from "react";
import BaseUrl from "../BaseUrl/BaseUrl";

const Form = ({ receiverId, setChats, chats }) => {
  const [message, setMessage] = useState("");

  const loggedInUserId = localStorage.getItem("id");

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BaseUrl}/chat/message/send/` + receiverId,
        {
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Message sent successfully from frontend: ");
      setChats([...chats, { content: message, sender: loggedInUserId }]);
      setMessage("");
    } catch (error) {
      console.log("Error sending message from frontend : " + error);
    }
  };

  return (
    <div className="p-4 absolute bottom-0 right-0 left-0 bg-white bg-opacity-50">
      <form onSubmit={handleMessageSubmit} action="" className="flex items-center">
        <input
          type="text"
          name=""
          id=""
          value={message}
          placeholder="Type Your Message"
          className="w-full p-2 border rounded-l-lg"
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* <input type="file" name="" id="file-upload" className='hidden'/> */}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Form;
