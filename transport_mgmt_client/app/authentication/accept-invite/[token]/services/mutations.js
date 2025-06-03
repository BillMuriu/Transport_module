import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(
        `${API_BASE_URL}/users/accept-invite/`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error(
        "User creation failed:",
        error.response?.data || error.message
      );
    },
  });
};
