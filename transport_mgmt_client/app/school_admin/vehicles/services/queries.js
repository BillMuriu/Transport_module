import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/vehicles/`);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch vehicles:", error);
    },
  });
};
