import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_PUBLIC_API_URL}`);
type Message = {
  roomId: string;
  author: string;
  messages: string;
  authorImage: string;
  userId: string;
  fileUrl?: string;
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleFormSubmit = async () => {
    const companyId = import.meta.env.VITE_COMPANY_ID;

    const payload = {
      roomId: companyId,
      author: `Tester Client`,
      messages: message,
      authorImage: `${import.meta.env.VITE_USER_IMAGE}`,
      userId: `${import.meta.env.VITE_USER_ID}`,
      fileUrl: undefined,
    };
    socket.emit("sendMessage", payload);
    setMessage("");
  };

  useEffect(() => {
    socket.emit("joinRoom", { roomId: `${import.meta.env.VITE_COMPANY_ID}` });
    socket.on("receiveMessage", (payload: Message) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("joinedRoom");
    };
  }, [import.meta.env.VITE_COMPANY_ID]);
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-header">
              <img
                src={msg.authorImage}
                alt={`${msg.author}'s avatar`}
                className="avatar"
                style={{ width: "50px", height: "50px" }}
              />
              <span className="author">{msg.author}</span>
            </div>
            <div className="message-body">
              <p>{msg.messages}</p>
              {msg.fileUrl && (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFormSubmit()}
        />
        {/* <button>Send</button> */}
      </div>
    </div>
  );
};

export default Chat;
