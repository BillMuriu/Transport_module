import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateStation = () => {
  return useMutation({
    mutationFn: async (stationData) => {
      const response = await axios.post(
        `${API_BASE_URL}/stations/`,
        stationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Station created successfully:", data);
    },
    onError: (error) => {
      console.error("Station creation failed:", error);
    },
  });
};

export const useUpdateStation = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/stations/${id}/`,
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
      console.error("Failed to update station:", error);
    },
  });

export const useDeleteStation = () =>
  useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/stations/${id}/`);
    },
    onError: (error) => {
      console.error("Failed to delete station:", error);
    },
  });
