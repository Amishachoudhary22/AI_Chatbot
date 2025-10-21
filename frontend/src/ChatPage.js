import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ChatPage({ setToken }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // For 3-dot menu
  const [hoveredChat, setHoveredChat] = useState(null);
  const [menuChat, setMenuChat] = useState(null);

  // For Rename Modal
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameTarget, setRenameTarget] = useState(null);

  const menuRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded ? decoded.sub.split("@")[0] : "User";

  // Fetch chat history
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat/history", {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setChats(data);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, [token]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuChat(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  const handleNewChat = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const newChat = await res.json();
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
      setMessages([]);
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const handleSend = async () => {
  if (!message.trim() || !activeChat) return;

  const res = await fetch(
    `http://localhost:8080/api/chat/${activeChat.id}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ message }),
    }
  );
  const updatedChat = await res.json();

  // ✅ Only replace that one chat
  setChats((prevChats) =>
    prevChats.map((c) => (c.id === updatedChat.id ? updatedChat : c))
  );
  setActiveChat(updatedChat);
  setMessages(updatedChat.messages || []);
  setMessage("");
};


  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setMessages(chat.messages);
  };

  // 🗑️ Delete chat
  const handleDeleteChat = async (chat) => {
    if (!window.confirm("Delete this chat permanently?")) return;
    try {
      await fetch(`http://localhost:8080/api/chat/${chat.id || chat._id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      setChats(chats.filter((c) => c.id !== chat.id));
      if (activeChat?.id === chat.id) {
        setActiveChat(null);
        setMessages([]);
      }
      setMenuChat(null);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  // ✏️ Rename chat (opens modal)
  const openRenameModal = (chat) => {
    setRenameTarget(chat);
    setRenameTitle(chat.title);
    setShowRenameModal(true);
    setMenuChat(null);
  };

  const confirmRename = async () => {
    if (!renameTitle.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/chat/${renameTarget.id || renameTarget._id}/rename`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ title: renameTitle }),
        }
      );
      const updated = await res.json();
      setChats(chats.map((c) => (c.id === updated.id ? updated : c)));
      if (activeChat?.id === renameTarget.id) setActiveChat(updated);
      setShowRenameModal(false);
      setRenameTarget(null);
    } catch (err) {
      console.error("Error renaming chat:", err);
    }
  };

  const menuItemStyle = {
    padding: "8px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  };

  return (
    <div
      className={darkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", height: "100vh" }}
    >
      {/* === SIDEBAR === */}
      <div
        className="sidebar"
        style={{
          width: "260px",
          backgroundColor: darkMode ? "#2c2c2c" : "#f5f5f5",
          borderRight: "1px solid #ddd",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            backgroundColor: "#10a37f",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + New Chat
        </button>

        {/* Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginTop: "10px",
            background: "none",
            border: "1px solid #aaa",
            padding: "8px",
            borderRadius: "5px",
            cursor: "pointer",
            color: darkMode ? "#fff" : "#333",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* === CHAT LIST === */}
        <div style={{ marginTop: "20px", flex: 1, overflowY: "auto" }}>
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id || chat._id}
                onMouseEnter={() => setHoveredChat(chat.id || chat._id)}
                onMouseLeave={() => setHoveredChat(null)}
                style={{
                  position: "relative",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  backgroundColor:
                    activeChat?.id === chat.id
                      ? darkMode
                        ? "#333"
                        : "#e0f7f1"
                      : "transparent",
                  color: darkMode ? "#fff" : "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background-color 0.15s ease",
                }}
              >
                <div onClick={() => handleSelectChat(chat)}>
                  {chat.title || "Untitled Chat"}
                </div>

                {hoveredChat === (chat.id || chat._id) && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuChat(chat);
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      padding: "0 5px",
                    }}
                  >
                    ⋮
                  </div>
                )}

                {menuChat?.id === chat.id && (
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      right: "25px",
                      top: "35px",
                      backgroundColor: darkMode ? "#222" : "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      zIndex: 10,
                      opacity: 1,
                      transform: "translateY(0)",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <div
                      onClick={() => openRenameModal(chat)}
                      style={{
                        ...menuItemStyle,
                        color: darkMode ? "#fff" : "#000",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = darkMode
                          ? "#333"
                          : "#f0f0f0")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      ✏️ Rename
                    </div>
                    <div
                      onClick={() => handleDeleteChat(chat)}
                      style={{
                        ...menuItemStyle,
                        color: "red",
                        borderBottom: "none",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = darkMode
                          ? "#333"
                          : "#f0f0f0")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      🗑️ Delete
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: darkMode ? "#bbb" : "#777" }}>No previous chats</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            backgroundColor: "#ff5555",
            color: "white",
            padding: "8px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* === MAIN CHAT AREA === */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          color: darkMode ? "#f1f1f1" : "#000",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
            backgroundColor: darkMode ? "#2b2b2b" : "#fafafa",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          🤖 {activeChat ? activeChat.title : "AI Chatbot"}
        </div>

        {!activeChat && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              opacity: 0.8,
            }}
          >
            <h2>👋 Welcome, {username}!</h2>
            <p>Start a new chat or select one from the sidebar.</p>
          </div>
        )}

        {activeChat && (
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: darkMode ? "#121212" : "#fff",
              transition: "none", // fixes dancing text bug
            }}
          >
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: "15px" }}>
                  <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
                  <span>{msg.content}</span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", opacity: 0.6 }}>
                Start chatting by sending your first message!
              </p>
            )}
          </div>
        )}

        {activeChat && (
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginRight: "10px",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#10a37f",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* === RENAME MODAL === */}
      {showRenameModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
            zIndex: 100,
          }}
          onClick={() => setShowRenameModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: darkMode ? "#222" : "#fff",
              color: darkMode ? "#fff" : "#000",
              padding: "20px 25px",
              borderRadius: "10px",
              width: "320px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h3>Rename Chat</h3>
            <input
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button
                onClick={() => setShowRenameModal(false)}
                style={{
                  marginRight: "10px",
                  background: "gray",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                style={{
                  background: "#10a37f",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fade-in keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

