// hooks/useFetchStudentsByRoute.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Custom hook to fetch students based on routeId
export const useFetchStudentsByRoute = (routeId) => {
  return useQuery({
    queryKey: ["studentsByRoute", routeId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/students/`, {
        params: {
          station__route: routeId,
        },
      });
      return response.data;
    },
    enabled: !!routeId,
    onError: (error) => {
      console.error("Error fetching students by route:", error);
    },
  });
};
