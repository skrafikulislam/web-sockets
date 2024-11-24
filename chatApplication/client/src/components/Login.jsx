import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BaseUrl from "../BaseUrl/BaseUrl";

const Login = ({ openSignUp }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform login logic here
    try {
      const res = await axios.post(`${BaseUrl}/chat/user/login`, loginData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("User Login Successful " + res.data);
      toast.success(res.data.message);
      if (res.data.success === true) {
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("token", res.data.token);
        navigate("/chat");
      }
    } catch (error) {
      console.log("Error Login the User  " + error);
    }
  };
  return (
    <div>
      <Toaster reverseOrder={false} position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form action="" onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            UserName
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter UserName"
            className="w-full px-3 py-2 border"
            onChange={handleChange}
            value={loginData.username}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full px-3 py-2 border"
            onChange={handleChange}
            value={loginData.password}
          />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <label htmlFor="rememberme" className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-gray-700">Remember Me</span>
          </label>
          <a href="" className="text-red-800">
            Forgot Password
          </a>
        </div>
        <div className="mb-4">
          {" "}
          <button type="submit" className="w-full bg-red-600 text-white py-2">
            Login
          </button>
        </div>
      </form>
      <div className="text-center">
        <span className="text-gray-700">Donot Have An Account?</span>
        <button className="text-red-800 ml-2 underline" onClick={openSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
