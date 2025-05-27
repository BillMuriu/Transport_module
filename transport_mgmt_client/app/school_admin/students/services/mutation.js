import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: async (studentData) => {
      const response = await axios.post(
        `${API_BASE_URL}/students/`,
        studentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Student created successfully:", data);
      // You can optionally invalidate or refetch queries here
    },
    onError: (error) => {
      console.error("Student creation failed:", error);
    },
  });
};
