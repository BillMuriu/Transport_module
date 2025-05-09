// hooks/useFetchStudentsByRoute.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

// Custom hook for infinite scrolling of students by routeId
export const useInfiniteStudentsByRoute = (routeId) => {
  return useInfiniteQuery({
    queryKey: ["studentsByRoute", routeId],
    enabled: !!routeId, // Ensure the hook runs only when routeId is available
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`${API_BASE_URL}/students/`, {
        params: {
          station__route: routeId,
          page: pageParam, // Page number to fetch
          page_size: 10, // Page size for each request
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      // Assuming `lastPage.next` is of the format '/students/?page=2&page_size=10'
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get("page");
        return nextPage ? parseInt(nextPage, 10) : undefined;
      }
      return undefined; // No more pages
    },
  });
};
