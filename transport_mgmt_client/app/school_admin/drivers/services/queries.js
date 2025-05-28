// src/app/(your-folder)/services/queries.js or queries.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/drivers/`);
      return response.data.results;
    },
  });
};

export const useDriver = (id) => {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/drivers/${id}/`);
      return response.data;
    },
    enabled: !!id, // prevent the query from running if `id` is undefined
  });
};
