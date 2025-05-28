import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/stations/`);
      return response.data;
    },
  });
};

export const useStation = (id) => {
  return useQuery({
    queryKey: ["stations", id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/stations/${id}/`);
      return response.data;
    },
    enabled: !!id, // only fetch if id is truthy
  });
};
