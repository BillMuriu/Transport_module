import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_BASE_URL}/auth/token/`, data, {
        headers: {
          "Content-Type": "application/json", // Ensure the content type is JSON
        },
      });
      return response.data; // The response should contain the access and refresh tokens
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
