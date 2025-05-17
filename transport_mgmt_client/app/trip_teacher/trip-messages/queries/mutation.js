import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateTripMessage = () => {
  return useMutation({
    mutationFn: async (messageData) => {
      const response = await axios.post(
        `${API_BASE_URL}/trip-messages/send/`,
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Trip message sent successfully:", data);
    },
    onError: (error) => {
      console.error("Trip message failed to send:", error);
    },
  });
};

export const useCreateArrivedMessage = () => {
  return useMutation({
    mutationFn: async ({ trip_id, student_ids }) => {
      const response = await axios.post(
        `${API_BASE_URL}/trip-messages/send-bulk-messages/`,
        {
          trip_id,
          student_ids,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Arrival messages sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send arrival messages:", error);
    },
  });
};
