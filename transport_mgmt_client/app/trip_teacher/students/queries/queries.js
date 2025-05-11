import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Infinite scrolling students by routeId
export const useInfiniteStudentsByRoute = (routeId) => {
  return useInfiniteQuery({
    queryKey: ["studentsByRoute", routeId],
    enabled: !!routeId,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`${API_BASE_URL}/students/`, {
        params: {
          station__route: routeId,
          page: pageParam,
          page_size: 10,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get("page");
        return nextPage ? parseInt(nextPage, 10) : undefined;
      }
      return undefined;
    },
  });
};

export const useRouteStudentTotal = (routeId) => {
  return useQuery({
    queryKey: ["routeStudentTotal", routeId],
    enabled: !!routeId,
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/students/route-total/`,
        {
          params: { route_id: routeId },
        }
      );
      return response.data;
    },
  });
};
