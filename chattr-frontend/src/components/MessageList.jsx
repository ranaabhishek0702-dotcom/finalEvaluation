import React, { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  const username = localStorage.getItem("username");

  return (
    <div className="messages-container" ref={ref}>
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-text">
            <h3>No messages yet</h3>
            <p>Be the first to start the conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((m, i) => {
          const messageKey = `${m.sender}-${m.time || i}-${i}`;
          const isOwn = m.sender === username;
          
          return (
            <div 
              key={messageKey} 
              className={`message ${isOwn ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <div className="message-meta">
                  <span className="message-sender">{m.sender}</span>
                  <span className="message-time">
                    {new Date(m.time || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="message-bubble">{m.message}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}