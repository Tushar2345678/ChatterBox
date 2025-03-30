import React from "react";
import { Routes, Route } from "react-router";
import App from '../App.jsx';
import ChatPage from "../components/ChatPage.jsx";
const AppRoutes = () => {   
    return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<h1>This is about Page</h1>} />
        <Route path="*" element={<h1>404 Page not found</h1>} />
      </Routes>
      );
};

export default AppRoutes;