import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/students/`);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch students:", error);
    },
  });
};
