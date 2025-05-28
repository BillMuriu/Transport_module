import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateVehicle = () => {
  return useMutation({
    mutationFn: async (vehicleData) => {
      const response = await axios.post(
        `${API_BASE_URL}/vehicles/`,
        vehicleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Vehicle created successfully:", data);
    },
    onError: (error) => {
      console.error("Vehicle creation failed:", error);
    },
  });
};

export const useUpdateVehicle = (id) =>
  useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${id}/`,
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
      console.error("Failed to update vehicle:", error);
    },
  });

export const useDeleteVehicle = () =>
  useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/vehicles/${id}/`);
    },
    onError: (error) => {
      console.error("Failed to delete vehicle:", error);
    },
  });
