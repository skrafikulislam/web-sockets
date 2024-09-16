// client site - main - where the first message send  -- localhost:5174
// profiles of all diff professionals , whom the text need to send after selecting them

 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsChatLeftText } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import BaseUrl from "../../BaseUrl/BaseUrl";

const socket = io("http://localhost:5000");

const ImageGallery = () => {
  const [professionalUser, setProfessionalUser] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProfessionalUser();
  }, []);

  const fetchAllProfessionalUser = async () => {
    try {
      const allProfessionalUsers = await axios.get(
        `${BaseUrl}/api/v1/users/professional/allusers`
      );
      setProfessionalUser(allProfessionalUsers.data);
    } catch (error) {
      console.log("Error Fetching All Professional Users From DB" + error);
    }
  };

  const toggleFavorite = (categoryName) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(categoryName)
        ? prevFavorites.filter((fav) => fav !== categoryName)
        : [...prevFavorites, categoryName]
    );
  };

  const handleChat = (professional) => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.emit("sendMessage", {
        sender: "ClientName", // Use actual client name or ID
        receiver: professional.firstName, // Professional's name
        message: "Hello, I'd like to inquire about your services.",
      });
      navigate(`/chatpanel/${professional.firstName}`);
    } else {
      navigate("/signup");
    }
  };

  return (
    <div>
      <section className="bg-black text-white p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionalUser.map((user, index) => (
            <div key={index} className="relative p-4 bg-gray-800 rounded-2xl">
              <img
                onClick={() => navigate("/price")}
                src="https://images.pexels.com/photos/3347413/pexels-photo-3347413.jpeg"
                alt={user.firstName}
                className="rounded-2xl cursor-pointer mb-4 transform transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <h3 className="text-xl font-semibold mb-2">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-400 mb-4">
                This Industry Runs on {user.lastName.toUpperCase()} Name.
              </p>

              <div className="absolute bottom-2 right-2 flex items-center gap-5">
                <div
                  onClick={() => handleChat(user)}
                  className="cursor-pointer text-white bg-green-400 p-3 rounded-full"
                >
                  <BsChatLeftText className="text-green-900 w-7 h-7 " />
                </div>
                <div
                  className="cursor-pointer text-white"
                  onClick={() => toggleFavorite(user.firstName)}
                >
                  {favorites.includes(user.firstName) ? (
                    <FaHeart className="text-red-500 w-7 h-7" />
                  ) : (
                    <FaRegHeart className="text-white w-7 h-7" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ImageGallery;


// chatpanel for clients - panel one -

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi"; // Icon for send button
import { FaRegSmile } from "react-icons/fa"; // Icon for emoji picker
import Picker from "emoji-picker-react"; // Icon for send button
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const ClientChatPanel = () => {
  const [username, setUsername] = useState("");
  const [activeChatUser, setActiveChatUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker
  const { professional } = useParams();

  const clientName = localStorage.getItem("name");

  // const users = ["Vegeta", "Goku"];
  const users = [professional];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    setUsername(clientName);
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

    setShowEmojiPicker(false);
  };

  // Corrected function to handle emoji selection
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji); // Correctly append selected emoji to the message
  };

  return (
    <div className="flex h-screen container mx-auto max-w-screen-2xl bg-gray-900 mb-5 mt-10 text-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-300 p-4 shadow-lg flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-green-400">Chats</h2>
        <ul className="flex-grow overflow-y-auto space-y-4">
          {users.map((user, i) => (
            <li key={i}>
              <button
                onClick={() => setActiveChatUser(user)}
                className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ease-in-out ${
                  activeChatUser === user
                    ? "bg-green-500 text-white shadow-md font-bold"
                    : "bg-gray-700 hover:bg-gray-600 font-medium"
                }`}
              >
                {user}
                <span className="text-sm flex flex-col text-gray-100">
                  {"9064281142"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4 bg-gray-800 shadow-lg rounded-lg p-6 ml-4">
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                {activeChatUser}
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto space-y-3 px-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex transition-all duration-300 ease-in-out ${
                    msg.sender === username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md max-w-xs ${
                      msg.sender === username
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {msg.sender}
                    </span>
                    <span className="block mt-1">{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="mt-4 border-t border-gray-700 pt-4 flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 border border-gray-600 rounded-full bg-gray-700 text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out"
              />
              {/* Emoji Picker Button */}
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="ml-2 text-gray-400 hover:text-green-400 transition duration-200 ease-in-out"
              >
                <FaRegSmile size={24} />
              </button>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                className="ml-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
              >
                <FiSend className="mr-1" /> Send
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 z-50">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full bg-gray-700 rounded-3xl">
            <h2 className="text-4xl font-bold text-gray-200">
              Select User to Start Chatting
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientChatPanel;

-----------------------------------------------------------------------------------------------
// this is port two localhost:5173
// this is other site where professional can see the messages and start communication

// analytics page is for the active real time message send notification shown and start communicating

import axios from "axios";
import { useEffect, useState } from "react";
//import ChatPanel from "./ChatPanel"; // Import the ChatPanel component
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Analytics = () => {
  const [landingUser, setLandingUser] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);

  const BaseUrl = "http://localhost:5000/api/v1";

  useEffect(() => {
    fetchLandingUser();

    // Listen for new client inquiries in real-time
    socket.on("newClientInquiry", (data) => {
      setRecentInquiries((prev) => [...prev, data.sender]);
    });

    return () => {
      socket.off("newClientInquiry");
    };
  }, []);

  const fetchLandingUser = async () => {
    try {
      const landingUser = await axios.get(`${BaseUrl}/landing/allUsers/data`);
      setLandingUser(landingUser.data);
    } catch (error) {
      console.log("Error Fetching Landing Users From Database" + error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-center md:justify-between p-4 md:py-8 bg-white rounded-lg shadow-md">
        {/* Profile Image Section */}
        <div className="mx-auto md:mx-0">
          <img
            className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-700 p-1"
            src="https://media.istockphoto.com/id/610041376/photo/beautiful-sunrise-over-the-sea.jpg?s=612x612&w=0&k=20&c=R3Tcc6HKc1ixPrBc7qXvXFCicm8jLMMlT99MfmchLNA="
            alt="profile"
          />
        </div>

        {/* Profile Info Section */}
        <div className="mt-4 md:mt-0 md:w-7/12 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Shashank Ranjan
          </h2>

          {/* Profile Stats */}
          <ul className="flex flex-col md:flex-row justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-8 mt-4 mb-4">
            <li>
              <span className="font-semibold">200+</span> Customers
            </li>
            <li>
              <span className="font-semibold">10+</span> Yrs Experience
            </li>
            <li>
              <span className="font-semibold">27</span> Yrs Age
            </li>
          </ul>

          {/* Profile Occupation */}
          <div className="text-sm md:text-base font-semibold">
            <p>
              Model at <span className="text-primary">Bollywood</span>
            </p>
          </div>
        </div>
      </header>

      {/* Analytics and Recent Enquiries Section */}
      <div className="flex flex-col md:flex-row justify-between mt-8 space-y-6 md:space-y-0 md:space-x-6 mb-10 md:mb-0">
        {/* Recent Enquiries Section */}
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Recent Enquiries</h2>
          <div className="overflow-x-auto ">
            <table className="min-w-full  bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-center py-3 px-4">S.NO</th>
                  <th className="text-center py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">Name</th>
                  <th className="text-center py-3 px-4">Contact No</th>
                  <th className="text-center py-3 px-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {landingUser.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 align-middle">{index + 1}</td>
                    <td className="py-3 md:px-4 px-0 align-middle">
                      {"28/12/2001"}
                    </td>
                    <td className="py-3  align-middle">{user.username}</td>
                    <td className="py-3 px-4 align-middle">{user.phone}</td>
                    <td className="py-3 px-4 align-middle">
                      <button
                        onClick={() => navigate(`/chatpanel/${user.username}`)}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Text
                      </button>
                      {/* Real-time green dot for new messages */}
                      {recentInquiries.includes(user.username) && (
                        <div className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <div className="border rounded-lg p-4 mb-4 mt-0 md:mt-20">
            <h3 className="font-bold mb-2">Today</h3>
            <p>New visitors: 25</p>
            <p>Downloads: 15</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">This Month</h3>
            <p>New visitors: 585</p>
            <p>Downloads: 359</p>
            <p>Total Visitors: 1,365</p>
            <p>Total Downloads: 958</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;


// chatpanel - two

// // src/Chat.jsx
// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { FiSend } from "react-icons/fi"; // Icon for send button
// import { FaRegSmile } from "react-icons/fa"; // Icon for emoji picker
// import Picker from "emoji-picker-react"; // Icon for send button
// import { useParams } from "react-router-dom";

// const socket = io("http://localhost:5000");

// const ChatPanel = () => {
//   const [username, setUsername] = useState("");
//   const [activeChatUser, setActiveChatUser] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker
//   const { client } = useParams();

//   const professionalName = localStorage.getItem("professionalName");

//   // const users = ["Vegeta", "Goku"];
//   // const users = [(client) => [...client, client]];
//   const users = [client];

//   useEffect(() => {
//     if (activeChatUser) {
//       socket.emit("joinChat", { sender: username, receiver: activeChatUser });

//       socket.on("previousMessages", (chatHistory) => {
//         setMessages(chatHistory);
//       });

//       socket.on("newMessage", (newMsg) => {
//         setMessages((prevMessages) => [...prevMessages, newMsg]);
//       });

//       return () => {
//         socket.off("previousMessages");
//         socket.off("newMessage");
//       };
//     }
//     setUsername(professionalName);
//   }, [activeChatUser]);

//   const sendMessage = () => {
//     if (message && activeChatUser) {
//       const newMessage = {
//         sender: username,
//         receiver: activeChatUser,
//         message,
//       };
//       socket.emit("sendMessage", newMessage);
//       setMessage("");
//     }

//     setShowEmojiPicker(false);
//   };

//   // Corrected function to handle emoji selection
//   const handleEmojiClick = (emojiData) => {
//     setMessage((prev) => prev + emojiData.emoji); // Correctly append selected emoji to the message
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 mb-5">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white text-gray-800 p-4 shadow-lg flex flex-col">
//         <h2 className="text-xl font-bold mb-6 text-green-600">Chats</h2>
//         <ul className="flex-grow overflow-y-auto space-y-4">
//           {users.map((user, i) => (
//             <li key={i}>
//               <button
//                 onClick={() => setActiveChatUser(user)}
//                 className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ease-in-out ${
//                   activeChatUser === user
//                     ? "bg-green-100 text-green-800 shadow-md font-bold"
//                     : "bg-white hover:bg-gray-100 font-medium"
//                 }`}
//               >
//                 {user} <span className="flex flex-col">{"9064281142"}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Window */}
//       <div className="flex flex-col w-3/4 bg-white shadow-lg rounded-lg p-6 ml-4">
//         {activeChatUser ? (
//           <>
//             {/* Chat Header */}
//             <div className="flex justify-between items-center border-b pb-4 mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {activeChatUser}
//               </h2>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-grow overflow-y-auto space-y-3 px-4">
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`flex transition-all duration-300 ease-in-out ${
//                     msg.sender === username ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-3 rounded-lg shadow-md max-w-xs ${
//                       msg.sender === username
//                         ? "bg-green-500 text-white"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                   >
//                     <span className="block text-sm font-semibold">
//                       {msg.sender}
//                     </span>
//                     <span className="block mt-1">{msg.message}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="mt-4 border-t pt-4 flex items-center">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-grow p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 ease-in-out"
//               />
//               {/* Emoji Picker Button */}
//               <button
//                 onClick={() => setShowEmojiPicker((prev) => !prev)}
//                 className="ml-2 text-gray-500 hover:text-green-500 transition duration-200 ease-in-out"
//               >
//                 <FaRegSmile size={24} />
//               </button>

//               {/* Send Button */}
//               <button
//                 onClick={sendMessage}
//                 className="ml-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
//               >
//                 <FiSend className="mr-1" /> Send
//               </button>

//               {/* Emoji Picker */}
//               {showEmojiPicker && (
//                 <div className="absolute bottom-16  z-50">
//                   <Picker onEmojiClick={handleEmojiClick} />
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex justify-center items-center h-full bg-green-200 rounded-3xl">
//             <h2 className="text-4xl font-bold text-gray-800">
//               Select User to Start Chatting
//             </h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPanel;

// src/Chat.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi"; // Icon for send button
import { FaRegSmile } from "react-icons/fa"; // Icon for emoji picker
import Picker from "emoji-picker-react"; // Icon for send button
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const ChatPanel = () => {
  const [username, setUsername] = useState("");
  const [activeChatUser, setActiveChatUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { client } = useParams();

  const professionalName = localStorage.getItem("professionalName");
  const users = [client];

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
    setUsername(professionalName);
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
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex h-screen bg-gray-50 mb-5">
      {/* Sidebar */}
      <div className="w-1/4 bg-white text-gray-800 p-4 shadow-2xl flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Chats</h2>
        <ul className="flex-grow overflow-y-auto space-y-4">
          {users.map((user, i) => (
            <li key={i}>
              <button
                onClick={() => setActiveChatUser(user)}
                className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ease-in-out ${
                  activeChatUser === user
                    ? "bg-blue-100 text-blue-800 shadow-lg font-bold"
                    : "bg-white hover:bg-gray-100 font-medium"
                }`}
              >
                {user} <span className="flex flex-col">{"9064281142"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4 bg-white shadow-2xl rounded-lg p-6 ml-4">
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeChatUser}
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto space-y-3 px-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex transition-all duration-300 ease-in-out ${
                    msg.sender === username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-2xl max-w-xs ${
                      msg.sender === username
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {msg.sender}
                    </span>
                    <span className="block mt-1">{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="mt-4 border-t pt-4 flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 border border-gray-300 rounded-full shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out"
              />
              {/* Emoji Picker Button */}
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-blue-500 transition duration-200 ease-in-out"
              >
                <FaRegSmile size={24} />
              </button>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-2xl transition duration-300 ease-in-out flex items-center"
              >
                <FiSend className="mr-1" /> Send
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 z-50">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full bg-gray-100 rounded-3xl">
            <h2 className="text-4xl font-bold text-gray-800">
              Select User to Start Chatting
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
------------------------------------------------------------------------------------------------------

backend for that
// import { Server } from "socket.io";
// import Message from "../../model/message/message.js";

// const initializeSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("New client connected - socket connection established");

//     socket.on("joinChat", async ({ sender, receiver }) => {
//       const room = [sender, receiver].sort().join("_");
//       socket.join(room);

//       try {
//         // Find the document that contains messages between the sender and receiver
//         const chat = await Message.findOne({
//           participants: { $all: [sender, receiver] },
//         });

//         // Send previous messages if they exist
//         if (chat) {
//           socket.emit("previousMessages", chat.messages);
//         } else {
//           socket.emit("previousMessages", []); // Send empty array if no messages exist
//         }
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }

//     });

//     //? Message sent from frontend
//     socket.on("sendMessage", async (data) => {
//       const { sender, receiver, message } = data;
//       const room = [sender, receiver].sort().join("_");

//       try {
//         // Find the chat document for the participants
//         let chat = await Message.findOne({
//           participants: { $all: [sender, receiver] },
//         });

//         if (chat) {
//           // If chat document exists, push new message to messages array
//           chat.messages.push({ sender, message });
//           await chat.save();
//         } else {
//           // If chat document doesn't exist, create a new one
//           chat = new Message({
//             participants: [sender, receiver],
//             messages: [{ sender, message }],
//           });
//           await chat.save();
//         }

//         // Emit the new message to the specific room //? fetching the new messages and send to frontend to show on chats
//         io.to(room).emit("newMessage", {
//           sender,
//           message,
//           timestamp: new Date(),
//         });

//       } catch (err) {
//         console.error("Error saving message:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
//   });
// };

// export default initializeSocket;

import { Server } from "socket.io";
import Message from "../../model/message/message.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected - socket connection established");

    socket.on("joinChat", async ({ sender, receiver }) => {
      const room = [sender, receiver].sort().join("_");
      socket.join(room);

      try {
        const chat = await Message.findOne({
          participants: { $all: [sender, receiver] },
        });

        if (chat) {
          socket.emit("previousMessages", chat.messages);
        } else {
          socket.emit("previousMessages", []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    });

    // Send message from client to professional
    socket.on("sendMessage", async (data) => {
      const { sender, receiver, message } = data;
      const room = [sender, receiver].sort().join("_");

      try {
        let chat = await Message.findOne({
          participants: { $all: [sender, receiver] },
        });

        if (chat) {
          chat.messages.push({ sender, message });
          await chat.save();
        } else {
          chat = new Message({
            participants: [sender, receiver],
            messages: [{ sender, message }],
          });
          await chat.save();
        }

        io.to(room).emit("newMessage", {
          sender,
          message,
          timestamp: new Date(),
        });

        // Notify professionals about new client inquiries
        io.emit("newClientInquiry", { sender });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default initializeSocket;

in index.js which is main - just add the function like initializeSocket(server);
which is coming from import express from "express";
import http from "http";
const app = express();
//? for chat api
const server = http.createServer(app);
