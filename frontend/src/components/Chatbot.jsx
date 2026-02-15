import { useState, useRef, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./propertyCard";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 
  useEffect(() => {
    const storedSession = localStorage.getItem("active_session");

    if (!storedSession) return;

    setSessionId(storedSession);

    axios
      .get(`${import.meta.env.VITE_API_URL}/${storedSession}`)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch((err) => {
        console.error("Error loading history:", err);
      });

  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login first");
      return;
    }

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/`,
        
        {
          message: message,
          user_id: userId,
          session_id: sessionId,
        }
      );
      console.log("RESPONSE DATA:", response.data);

      const newSessionId = response.data.session_id;

      //Save session
      setSessionId(newSessionId);
      localStorage.setItem("active_session", newSessionId);

      const botMessage = {
        sender: "bot",
        text: response.data.reply,
        properties: response.data.properties || [],
      };

      setMessages((prev) => [...prev, botMessage]);

      setMessage("");

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const newChat = () => {
    setSessionId(null);
    setMessages([]);
    localStorage.removeItem("active_session");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Real Estate Assistant</h1>

        <div className="flex gap-2">
          <button
            onClick={newChat}
            className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 transition"
          >
            New Chat
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user_id");
              localStorage.removeItem("active_session");
              window.location.href = "/login";
            }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>

          <button
            onClick={() => window.location.href = "/saved"}
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
          >
            Saved ❤️
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => (
          <div key={index}>

            {/* Message Bubble */}
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white text-black shadow"
              }`}
            >
              {msg.text}
            </div>

            {/* Show properties under bot message */}
            {msg.sender === "bot" &&
              msg.properties &&
              msg.properties.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {msg.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}

          </div>
        ))}

        {loading && (
          <div className="bg-white px-4 py-2 rounded-lg shadow w-fit">
            Typing...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>

    </div>
  );
}
