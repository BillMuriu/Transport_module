import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useSendGradeMessage = () => {
  return useMutation({
    mutationFn: async (messageData) => {
      const response = await axios.post(
        `${API_BASE_URL}/messaging/send-bulk-grade-message/`,
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
      console.log("Bulk message sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send bulk message:", error);
    },
  });
};
