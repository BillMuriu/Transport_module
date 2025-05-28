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

export const useUpdateStudent = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/students/${id}/`,
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
      console.error("Failed to update student:", error);
    },
  });

export const useDeleteStudent = () =>
  useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/students/${id}/`);
    },
    onError: (error) => {
      console.error("Failed to delete student:", error);
    },
  });
