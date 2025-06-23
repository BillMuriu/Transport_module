import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateTemplate = () => {
  return useMutation({
    mutationFn: async (templateData) => {
      const response = await axios.post(
        `${API_BASE_URL}/messaging/templates/`,
        templateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
};

export const useUpdateTemplate = (id) => {
  return useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${API_BASE_URL}/messaging/templates/${id}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
};

export const useDeleteTemplate = () => {
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/messaging/templates/${id}/`);
    },
  });
};
