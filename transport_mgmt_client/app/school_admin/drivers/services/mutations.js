import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateDriver = () => {
  return useMutation({
    mutationFn: async (driverData) => {
      const response = await axios.post(
        `${API_BASE_URL}/drivers/`,
        driverData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Driver created successfully:", data);
    },
    onError: (error) => {
      console.error("Driver creation failed:", error);
    },
  });
};

export const useUpdateDriver = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/drivers/${id}/`,
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
      console.error("Failed to update driver:", error);
    },
  });

export const useDeleteDriver = () =>
  useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/drivers/${id}/`);
    },
    onError: (error) => {
      console.error("Failed to delete driver:", error);
    },
  });
