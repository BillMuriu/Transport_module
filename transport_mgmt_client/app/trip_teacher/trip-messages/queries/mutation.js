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
