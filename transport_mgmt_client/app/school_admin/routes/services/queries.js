import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Fetch all routes
export const useRoutes = (schoolId) => {
  return useQuery({
    queryKey: ["routes", schoolId || "all"],
    enabled: !!schoolId,
    queryFn: async () => {
      const url = schoolId
        ? `${API_BASE_URL}/routes/?school=${schoolId}`
        : `${API_BASE_URL}/routes/`;
      const response = await axios.get(url);
      return response.data;
    },
  });
};

// Fetch a single route by ID
export const useRoute = (id) => {
  return useQuery({
    queryKey: ["route", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/routes/${id}/`);
      return response.data;
    },
    enabled: !!id, // prevents query from running if id is undefined
  });
};
