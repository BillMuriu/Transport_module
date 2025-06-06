import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export function useSendTripMessages() {
  return useMutation({
    mutationFn: async ({ tripId, studentIds }) => {
      const payload = {
        trip_id: tripId,
        student_ids: studentIds,
      };

      const url = `${API_BASE_URL}/trip-messages/send-bulk-messages-mobilesasa/`;
      console.log("Sending POST to:", url);
      console.log("Payload:", payload);

      const response = await axios.post(url, payload);
      return response.data;
    },
  });
}
