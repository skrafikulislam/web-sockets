import React, { useEffect, useState } from "react";
import Model from "../components/Model";
import Register from "../components/Register";
import Login from "../components/Login";
import axios from "axios";
import BaseUrl from "../BaseUrl/BaseUrl";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);

  const openSignUp = () => {
    setIsModelOpen(true);
    setIsLogIn(false);
  };

  const openLogin = () => {
    setIsModelOpen(true);
    setIsLogIn(true);
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const navigate = useNavigate();

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/chat/user/verify`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success === true) {
        // User is authenticated, redirect to chat page
        navigate("/chat");
      } else {
        // User is not authenticated, keep them on the home page
        navigate("/");
      }
    } catch (error) {
      console.log("Error verifying User on Home Page: " + error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div
        className="bg-cover w-2/4 h-[calc(100vh-60px)] rounded-lg flex items-center justify-center"
        style={{
          backgroundImage: "url('/chat-bg.jpg')",
        }}
      >
        <div className="text-center">
          <h2 className="text-6xl py-3 bg-white bg-opacity-80 font-bold text-gray-700 rounded-lg ">
            Welcome to My Chat App
          </h2>
          <button
            onClick={() => setIsModelOpen(true)}
            className="p-3 hover:bg-blue-800 rounded-lg mt-2 bg-blue-600 text-white text-3xl font-bold"
          >
            Login / SignUp
          </button>
        </div>
      </div>
      <Model isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
        {isLogIn ? (
          <Login openSignUp={openSignUp} />
        ) : (
          <Register openLogin={openLogin} />
        )}
      </Model>
    </div>
  );
};

export default Home;
