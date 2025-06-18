import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useStations = (routeId, schoolId) => {
  return useQuery({
    queryKey: ["stations", routeId, schoolId], // include both in cache key
    queryFn: async () => {
      const params = new URLSearchParams();

      if (routeId) params.append("route_id", routeId);
      if (schoolId) params.append("school", schoolId);

      const url = `${API_BASE_URL}/stations/?${params.toString()}`;

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
