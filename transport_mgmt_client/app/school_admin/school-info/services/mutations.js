import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useUpdateSchool = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/schools/${id}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to update school:", error);
    },
  });
