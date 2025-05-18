import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export function useSendTripMessages() {
  return useMutation({
    mutationFn: async ({ tripId, phoneNumbers }) => {
      const payload = {
        trip_id: tripId,
        phone_numbers: phoneNumbers,
      };

      const url = `${API_BASE_URL}/trip-messages/send-bulk/`;
      console.log("Sending POST to:", url);
      console.log("Payload:", payload);

      const response = await axios.post(url, payload);
      return response.data;
    },
  });
}
