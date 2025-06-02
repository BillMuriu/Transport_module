"use client";

import { useState } from "react";

export default function LocationButton() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError("");
        console.log("Location obtained:", position.coords);
      },
      (err) => {
        const errorMessages = {
          1: "Permission denied. Please enable location services in your browser settings.",
          2: "Position unavailable. Please check your internet or GPS.",
          3: "Request timed out. Try again.",
        };
        const message = errorMessages[err.code] || "Unknown error occurred.";
        setError(`Geolocation error: ${message}`);
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={getLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Get My Location
      </button>

      {coords && (
        <div className="text-sm text-gray-700">
          <p>Latitude: {coords.latitude}</p>
          <p>Longitude: {coords.longitude}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
