import { useState } from "react";
import axios from "axios";

export default function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/property/save", {
        user_id: userId,
        property: property,
      });

      setSaved(true);
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Failed to save property");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`absolute top-3 right-3 px-3 py-1 text-sm rounded-full transition ${
          saved
            ? "bg-green-500 text-white"
            : "bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
        }`}
      >
        {saved ? "Saved ✓" : "Save ❤️"}
      </button>

      <img
        src={property.image_url}
        alt={property.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold">{property.title}</h2>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-blue-600 font-semibold">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-sm mt-2">
          {property.bedrooms} Bed • {property.bathrooms} Bath
        </p>

        <div className="flex flex-wrap gap-1 mt-2">
          {property.amenities.map((a, index) => (
            <span
              key={index}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
