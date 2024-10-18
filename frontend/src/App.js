import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import "./App.css"; // We'll create this file for custom styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoutes />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function PrivateRoutes() {
  // Replace with actual authentication check
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container"> {/* ครอบ Sidebar และ main-content ไว้ใน app-container */}
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Post />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;