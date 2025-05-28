import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateRoute = () => {
  return useMutation({
    mutationFn: async (routeData) => {
      const response = await axios.post(`${API_BASE_URL}/routes/`, routeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Route created successfully:", data);
    },
    onError: (error) => {
      console.error("Route creation failed:", error);
    },
  });
};

export const useUpdateRoute = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/routes/${id}/`,
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
      console.error("Failed to update route:", error);
    },
  });

export const useDeleteRoute = () =>
  useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/routes/${id}/`);
    },
    onError: (error) => {
      console.error("Failed to delete route:", error);
    },
  });
