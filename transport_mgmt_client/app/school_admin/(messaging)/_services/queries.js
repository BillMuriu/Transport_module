import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/messaging/`);
      return response.data.results;
    },
  });
};
