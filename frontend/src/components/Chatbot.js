import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot({ open, onClose }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage("");

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMsg,
      });

      setChat((prev) => [
        ...prev,
        { role: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "❌ Server error / AI unavailable" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={`chatbot-container ${open ? "open" : ""}`}>
      {/* ================= HEADER ================= */}
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-header-title">
            <div className="ai-icon-dot"></div>
            <div>
              <h3 className="chatbot-title">MediCloud AI</h3>
              <p className="chatbot-status">Online</p>
            </div>
          </div>

          <button className="chatbot-minimize" onClick={onClose}>
            —
          </button>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="chatbot-messages">
        {chat.length === 0 && (
          <div className="chatbot-empty">
            <div className="chatbot-greeting-icon">🤖</div>
            <h4>Hello!</h4>
            <p>
              I’m MediCloud AI.  
              Ask me about your Health concerns,First Aid or any medical emergency .
            </p>
          </div>
        )}

        {chat.map((c, i) => (
          <div
            key={i}
            className={`message ${
              c.role === "user" ? "message-user" : "message-bot"
            }`}
          >
            <div className="message-avatar">
              {c.role === "user" ? "👤" : "🤖"}
            </div>

            <div className="message-content">
              <div className="message-bubble">{c.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message message-bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= INPUT ================= */}
      <div className="chatbot-input-area">
        <input
          className="chatbot-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask MediCloud AI…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />

        <button
          className="chatbot-send-btn"
          onClick={sendMessage}
          disabled={loading}
        >
          ➤
        </button>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="chatbot-footer">
        ⚠️ Informational only. Always consult a doctor.
      </div>
    </div>
  );
}
