import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// import { API_BASE_URL } from "@/config";
import { API_BASE_URL } from "@/config";

export const useSendTripMessages = () => {
  return useMutation({
    mutationFn: async ({ tripId, phoneNumbers }) => {
      const response = await axios.post(
        `${API_BASE_URL}/trip-messages/send-bulk/`,
        {
          trip_id: tripId,
          phone_numbers: phoneNumbers,
        }
      );
      return response.data;
    },
  });
};
