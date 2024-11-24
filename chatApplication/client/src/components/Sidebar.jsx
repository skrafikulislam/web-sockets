import axios from "axios";
import React, { useEffect, useState } from "react";
import BaseUrl from "../BaseUrl/BaseUrl";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setChatStarted, setChats, setReceiverId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/chat/users/allusers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Users fetched successfully: ", response.data);
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users in Sidebar : " + error);
      navigate("/");
    }
  };

  const startChat = async (id) => {
    try {
      const res = await axios.get(`${BaseUrl}/chat/message/read/` + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Message fetch successfully on frontend from database : ");
      setChats(res.data);
    } catch (error) {
      if (error.res.data.message === "No Data") {
        setChats([]);
      }
      console.log(
        "Error fetching message on frontend from database : " + error
      );
    }

    // socket.emit("join", id);
    setChatStarted(true);
    setReceiverId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-1/4 bg-black p-4 bg-opacity-70 relative">
      <input
        type="text"
        name=""
        id=""
        placeholder="Search"
        className="w-full p-2 mb-4 border rounded"
      />
      {users?.users?.length > 0 ? (
        <div className="space-y-4">
          {users?.users?.map((user) => (
            <div
              key={user?._id}
              onClick={() => startChat(user._id)}
              className="flex items-center justify-between space-x-4 p-2 hover:bg-gray-300 cursor-pointer mb-10"
            >
              <img
                src={`${BaseUrl}/uploads/${user.image}`}
                alt="User Image"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-white text-sm font-bold">
                {user?.username}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white font-bold">No Users Found</p>
      )}
      <button
        onClick={handleLogout}
        className="bottom-1 right-1 left-1 rounded hover:bg-blue-700 bg-blue-500 text-white p-2 absolute"
      >
        LogOut
      </button>
    </div>
  );
};

export default Sidebar;
