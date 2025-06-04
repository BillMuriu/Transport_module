import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { format } from "date-fns";

export const useTripById = (tripId) => {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/`);
      return response.data;
    },
    enabled: !!tripId, // ensures it only runs if tripId is truthy
  });
};

export const useTrips = ({ tripTeacherId, lastNDays } = {}) => {
  return useQuery({
    queryKey: ["trips", tripTeacherId, lastNDays],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (tripTeacherId) {
        params.append("trip_teacher", tripTeacherId);
      }

      if (lastNDays) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - lastNDays);

        params.append("start_date", format(startDate, "yyyy-MM-dd"));
        params.append("end_date", format(endDate, "yyyy-MM-dd"));
      }

      const response = await axios.get(
        `${API_BASE_URL}/trips/?${params.toString()}`
      );
      return response.data;
    },
  });
};
