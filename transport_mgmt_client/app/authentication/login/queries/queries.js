import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Custom hook to fetch user details based on userId
export const useFetchUserDetails = (userId) => {
  return useQuery({
    queryKey: ["userDetails", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/`);
      return response.data;
    },
    enabled: !!userId,
    onError: (error) => {
      console.error("Error fetching user details:", error);
    },
  });
};
