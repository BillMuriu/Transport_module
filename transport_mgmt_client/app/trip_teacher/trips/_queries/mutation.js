import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";

export const useCreateTrip = () => {
  const setOngoingTrip = useOngoingTripStore.getState().setOngoingTrip;

  return useMutation({
    mutationFn: async (tripData) => {
      const response = await axios.post(`${API_BASE_URL}/trips/`, tripData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Trip created successfully:", data);
      setOngoingTrip(data); // ✅ Save to Zustand store
    },
    onError: (error) => {
      console.error("Trip creation failed:", error);
    },
  });
};

export const useUpdateTrip = () => {
  return useMutation({
    mutationFn: async ({ tripId, updatedData }) => {
      console.log("Updating trip:", tripId, updatedData);
      console.log("URL:", `${API_BASE_URL}/trips/${tripId}/`);

      const response = await axios.put(
        `${API_BASE_URL}/trips/${tripId}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Trip updated successfully:", data);
    },
    onError: (error) => {
      console.error("Trip update failed:", error);
    },
  });
};
