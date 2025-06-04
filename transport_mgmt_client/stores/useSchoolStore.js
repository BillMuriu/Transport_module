import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSchoolStore = create(
  persist(
    (set) => ({
      school: null,
      setSchool: (school) => set({ school }),
      clearSchool: () => set({ school: null }),
    }),
    {
      name: "school-storage",
    }
  )
);
