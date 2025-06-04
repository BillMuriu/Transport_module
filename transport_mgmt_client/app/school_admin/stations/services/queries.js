import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useStations = (routeId) => {
  return useQuery({
    queryKey: ["stations", routeId], // include routeId in cache key
    queryFn: async () => {
      const url = routeId
        ? `${API_BASE_URL}/stations/?route_id=${routeId}`
        : `${API_BASE_URL}/stations/`;

      const response = await axios.get(url);
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
    enabled: !!id,
  });
};
