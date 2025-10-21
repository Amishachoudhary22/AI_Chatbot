import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import ChatPage from "./ChatPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Keep token state in sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to update token after login/logout
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/chat" /> : <AuthPage setToken={updateToken} />
          }
        />
        <Route
          path="/chat"
          element={
            token ? <ChatPage setToken={updateToken} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


