import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/propertyCard";

export default function SavedProperties() {
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/property/saved/${userId}`
        );

        setSaved(response.data.saved_properties || []);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    fetchSaved();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          ❤️ Saved Properties
        </h1>

        <button
          onClick={() => navigate("/chat")}
          className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
        >
          Back to Chat
        </button>
      </div>

      {/* Content */}
      {saved.length === 0 ? (
        <div className="text-white text-center mt-20 text-lg opacity-80">
          You haven’t saved any properties yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
