import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useVehicles = (schoolId) => {
  return useQuery({
    queryKey: ["vehicles", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const response = await axios.get(
        `${API_BASE_URL}/vehicles/?school=${schoolId}`
      );
      return response.data;
    },
    enabled: !!schoolId, // Only run query if schoolId exists
    onError: (error) => {
      console.error("Failed to fetch vehicles:", error);
    },
  });
};
