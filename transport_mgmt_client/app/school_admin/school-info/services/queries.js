import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useGetSchool = (id) =>
  useQuery({
    queryKey: ["school", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/schools/${id}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: !!id, // only run if `id` is truthy
    onError: (error) => {
      console.error("Failed to fetch school:", error);
    },
  });
