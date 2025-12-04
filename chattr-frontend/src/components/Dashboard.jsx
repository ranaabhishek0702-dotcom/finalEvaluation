import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  // Predefined channels - you can fetch these from backend if needed
  const channels = [
    { id: "general", name: "General", icon: "💬" },
    { id: "announcements", name: "Announcements", icon: "📢" },
    { id: "random", name: "Random", icon: "🎲" },
    { id: "tech", name: "Tech Talk", icon: "💻" },
    { id: "introductions", name: "Introductions", icon: "👋" },
  ];

  useEffect(() => {
    const user = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/");
      return;
    }

    setUsername(user);
    setSelectedChannel("general"); // default selection
  }, [navigate]);

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    // Navigate directly to chat room
    navigate(`/chat/${channelId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-inner">
          {/* Header */}
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>Chattr</h1>
              <p>Select a channel to start chatting</p>
            </div>
            <div className="user-info">
              <div className="user-avatar">{username?.charAt(0)?.toUpperCase()}</div>
              <div className="user-details">
                <span className="username-label">Logged in as</span>
                <span className="username-display">{username}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Channels Grid */}
          <div className="channels-section">
            <h2>Available Channels</h2>
            <div className="channels-grid">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`channel-card ${
                    selectedChannel === channel.id ? "selected" : ""
                  }`}
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  <div className="channel-icon">{channel.icon}</div>
                  <div className="channel-name">{channel.name}</div>
                  <div className="channel-id">#{channel.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
