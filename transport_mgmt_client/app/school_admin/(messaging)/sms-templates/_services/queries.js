import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/messaging/templates/`);
      return response.data.results;
    },
  });
};

export const useTemplate = (id) => {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/messaging/templates/${id}/`
      );
      return response.data;
    },
    enabled: !!id,
  });
};
