import React, { useState, useEffect, useRef } from "react";
import { runChat } from "./ChatService.js";
import "../styles/ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await runChat(userInput);
      setMessages([...newMessages, { role: "assistant", text: response }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Oops, something went wrong. Try again?" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button className="chat-toggle" onClick={toggleChat} aria-label="Open chat">
          💬
        </button>
      )}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>TrustShare Support</span>
            <button className="chat-close" onClick={toggleChat} aria-label="Close chat">
              ✕
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about file sharing..."
              aria-label="Chat input"
            />
            <button onClick={handleSend} aria-label="Send message">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;