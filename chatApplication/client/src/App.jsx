import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import io from "socket.io-client";
import BaseUrl from "./BaseUrl/BaseUrl";

const socket = io.connect(BaseUrl);

const App = () => {
  const ProtectedRoute = ({ element }) => {
    const authed = localStorage.getItem("token");

    return authed ? element : <Navigate to={"/"} replace />;
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={<ProtectedRoute element={<Chat socket={socket} />} />}
        />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>
    </div>
  );
};

export default App;
