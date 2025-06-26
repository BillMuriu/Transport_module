import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useGetInvitation = (token) => {
  return useQuery({
    queryKey: ["invitation", token],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/users/invitations/?token=${token}`
      );
      return response.data;
    },
    enabled: !!token, // only fetch if token is provided
    onError: (error) => {
      console.error(
        "Failed to fetch invitation:",
        error.response?.data || error.message
      );
    },
  });
};
