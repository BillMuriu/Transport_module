import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct the import
import { API_BASE_URL } from "@/config";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_BASE_URL}/auth/token/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response from backend:", response.data); // Debugging the response
      return response.data; // contains access and refresh tokens
    },
    onSuccess: (data) => {
      console.log("Success data:", data); // Log the success data
      try {
        const decoded = jwtDecode(data.access); // Decode access token
        const userId = decoded.user_id; // Adjust according to your token structure
        console.log("User ID from token:", userId);

        // Return the userId along with the data
        data.userId = userId; // Attach userId to data object
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
