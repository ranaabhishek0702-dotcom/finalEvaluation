import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsSending(true);
    onSend(text.trim());
    setText("");
    
    // Reset sending state after a brief delay
    setTimeout(() => setIsSending(false), 300);
  };

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  return (
    <form className="message-input-container" onSubmit={submit}>
      <div className="input-wrapper">
        <textarea
          className="input-field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          rows="1"
        />
      </div>
      <button
        className="send-button"
        type="submit"
        disabled={!text.trim() || isSending}
        title={!text.trim() ? "Type a message to send" : "Send message"}
      >
        {isSending ? "..." : "Send"}
      </button>
    </form>
  );
}