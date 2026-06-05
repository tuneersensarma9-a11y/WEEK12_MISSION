import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_typing", () => {
      setIsTyping(true);
    });

    socket.on("user_stopped_typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", message);
    socket.emit("stop_typing");

    setMessage("");
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>💬 Real-Time Chat Room</h1>
          <p>Powered by Socket.io</p>
        </div>

        <div className="chat-body">
          {messages.length === 0 ? (
            <p className="empty">No messages yet...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))
          )}
        </div>

        <div className="chat-footer">
          {isTyping && (
            <p className="typing-text">
              Someone is typing...
            </p>
          )}

          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              if (e.target.value.trim() !== "") {
                socket.emit("typing");
              } else {
                socket.emit("stop_typing");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;