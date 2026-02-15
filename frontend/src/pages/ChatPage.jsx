import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/Chatbot";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/chat/sessions/${userId}`
        );
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex p-6 gap-6">

      {/* Sidebar */}
      <div className="w-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">

        <h2 className="text-white text-lg font-bold mb-4">
          🕘 Previous Chats
        </h2>

        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className="bg-white/20 text-white p-2 rounded cursor-pointer hover:bg-white/30 transition text-sm"
              onClick={() => {
                localStorage.setItem("active_session", session.session_id);
                window.location.reload();
              }}
            >
              {session.last_message || "New Chat"}
            </div>
          ))}
        </div>

      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <ChatBox />
      </div>

    </div>
  );
}
