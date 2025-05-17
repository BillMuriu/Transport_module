import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useTripById = (tripId) => {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/`);
      return response.data;
    },
    enabled: !!tripId, // ensures it only runs if tripId is truthy
  });
};
