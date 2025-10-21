import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.text();
    setMessage(data);
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.token) {
        setToken(data.token);  // ✅ triggers re-render
        navigate("/chat");
    }

  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #10a37f, #2575fc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          padding: "40px",
          width: "380px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "28px",
            color: "#10a37f",
            marginBottom: "20px",
          }}
        >
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          style={{
            background: "#10a37f",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            width: "100%",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0e8c6b")}
          onMouseOut={(e) => (e.target.style.background = "#10a37f")}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={{ marginTop: "20px", color: "#555" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            style={{
              color: "#2575fc",
              marginLeft: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

        {message && (
          <p style={{ marginTop: "15px", color: "#ff5555" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "15px",
};

