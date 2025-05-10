import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTotalStudentsForRouteStore = create(
  persist(
    (set) => ({
      studentCount: null,
      setStudentCount: (count) => set({ studentCount: count }),
    }),
    {
      name: "total-students-for-route",
      getStorage: () => localStorage,
    }
  )
);

export default useTotalStudentsForRouteStore;
