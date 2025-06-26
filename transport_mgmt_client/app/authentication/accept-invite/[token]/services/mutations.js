import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateSchool = () => {
  return useMutation({
    mutationFn: async (schoolData) => {
      const response = await axios.post(
        `${API_BASE_URL}/schools/`,
        schoolData,
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
        "School creation failed:",
        error.response?.data || error.message
      );
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error("User ID is required for update");
      }
      const response = await axios.put(`${API_BASE_URL}/users/${id}/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error(
        "User update failed:",
        error.response?.data || error.message
      );
      throw error; // Re-throw to handle in the component
    },
  });
};

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
