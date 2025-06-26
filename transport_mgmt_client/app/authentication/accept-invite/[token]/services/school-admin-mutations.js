import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateSchoolAdmin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${API_BASE_URL}/users/accept-school-admin-invite/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error(
        "School admin creation failed:",
        error.response?.data || error.message
      );
    },
  });
};
