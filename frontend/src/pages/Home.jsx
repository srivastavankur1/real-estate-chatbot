import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 flex flex-col items-center justify-center text-white text-center px-6">

      <h1 className="text-5xl font-bold mb-6">
        AI Powered Real Estate Assistant
      </h1>

      <p className="max-w-2xl text-lg mb-8 opacity-90">
        Find your dream home instantly using our intelligent chatbot.
        Search by location, budget, bedrooms, and more —
        all through natural conversation.
      </p>

      <button
        onClick={() => {
          const userId = localStorage.getItem("user_id");
          navigate(userId ? "/chat" : "/login");
        }}
        className="bg-white text-purple-800 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition transform"
      >
        Try It Now
      </button>

    </div>
  );
}
