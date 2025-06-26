import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/users/invitations/`);
      return response.data;
    },
  });
};
