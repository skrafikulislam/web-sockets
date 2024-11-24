import axios from "axios";
import React, { useState } from "react";
import BaseUrl from "../BaseUrl/BaseUrl";
import toast, { Toaster } from "react-hot-toast";

const Register = ({ openLogin }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const formData = new FormData();

  formData.append("userData", JSON.stringify(userData));
  formData.append("image", file);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform registration logic here
      const res = await axios.post(`${BaseUrl}/chat/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("User Registration Successful " + res.data);
      toast.success(res.data.message);
      if (res.data.success === true) {
        openLogin();
      }
    } catch (error) {
      console.log("Error Sending Data For SignUp / Registration " + error);
    }
  };

  return (
    <div>
      <Toaster reverseOrder={false} position="top-right" />
      <h2 className="text-2xl font-bold mb-4">SignUp</h2>
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
            value={userData.username}
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
            value={userData.password}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            className="border p-2 block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold 
            file:bg-blue-500 file:text-white
            hover:file:bg-blue-700 hover:file:cursor-pointer 
          "
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="mb-4">
          {" "}
          <button type="submit" className="w-full bg-red-600 text-white py-2">
            Sign-Up
          </button>
        </div>
      </form>
      <div className="text-center">
        <span className="text-gray-700">Already Have An Account?</span>
        <button className="text-red-800 ml-2 underline" onClick={openLogin}>
          LogIn
        </button>
      </div>
    </div>
  );
};

export default Register;
