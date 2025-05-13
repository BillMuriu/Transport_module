import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Normal query: Fetch all students by routeId
export const useStudentsByRoute = (routeId) => {
  return useQuery({
    queryKey: ["studentsByRoute", routeId],
    enabled: !!routeId,
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/students/`, {
        params: {
          station__route: routeId,
        },
      });
      return response.data; // no .results here
    },
  });
};
