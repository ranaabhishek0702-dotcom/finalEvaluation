import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket } from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const room = channelId || "general"; // Use channelId from params, fallback to "general"

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const s = connectSocket();
    setSocket(s);
    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      s.emit("joinRoom", room);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    s.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    s.on("chatHistory", (history) => {
      setMessages(history);
    });

    s.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some(m => 
          m.time === msg.time && 
          m.sender === msg.sender && 
          m.message === msg.message
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      if (s) {
        s.disconnect();
      }
      socketRef.current = null;
    };
  }, [room, navigate]);

  const sendMessage = useCallback((msg) => {
    const currentSocket = socketRef.current;
    
    if (!currentSocket || !isConnected) {
      console.error("Socket not connected");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found");
      return;
    }

    // Optimistically add message to UI
    const tempMessage = {
      sender: username,
      message: msg,
      room: room,
      time: Date.now()
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    // Send to server
    currentSocket.emit("sendMessage", {
      sender: username,
      message: msg,
      room: room,
    });
  }, [isConnected, room]);

  const handleLeaveChannel = () => {
    navigate("/dashboard");
  };

  const getChannelName = () => {
    const channelMap = {
      general: "General",
      announcements: "Announcements",
      random: "Random",
      tech: "Tech Talk",
      introductions: "Introductions"
    };
    return channelMap[room] || room;
  };

  const username = localStorage.getItem("username");

  return (
    <div className="chatroom-page">
      <div className="chatroom-container">
        <div className="chat-room">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-title">
                <div className="chat-app-logo">💬</div>
                <div className="chat-header-content">
                  <h1># {getChannelName()}</h1>
                  <span className="channel-description">
                    {room === "general" && "General discussion"}
                    {room === "announcements" && "Important updates"}
                    {room === "random" && "Off-topic fun"}
                    {room === "tech" && "Tech discussions"}
                    {room === "introductions" && "Introduce yourself"}
                  </span>
                </div>
              </div>
              <div className="room-info">
                <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
                <span className="status-text">{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
            <div className="chat-header-right">
              <span className="user-badge">{username}</span>
              <button className="leave-channel-btn" onClick={handleLeaveChannel}>
                ← Back
              </button>
            </div>
          </div>
          <MessageList messages={messages} />
          <MessageInput onSend={sendMessage} socket={socket} />
        </div>
      </div>
    </div>
  );
}
