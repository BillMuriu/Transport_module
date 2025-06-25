import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useStudents = (schoolId) => {
  return useQuery({
    queryKey: ["students", schoolId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/students/?school=${schoolId}`
      );
      return response.data;
    },
    enabled: !!schoolId,
    onError: (error) => {
      console.error("Failed to fetch students:", error);
    },
  });
};
