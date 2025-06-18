import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSelectedSchoolStore = create(
  persist(
    (set) => ({
      selectedSchool: null,
      setSelectedSchool: (school) => set({ selectedSchool: school }),
      clearSelectedSchool: () => set({ selectedSchool: null }),
    }),
    {
      name: "selected-school-store", // localStorage key
    }
  )
);
