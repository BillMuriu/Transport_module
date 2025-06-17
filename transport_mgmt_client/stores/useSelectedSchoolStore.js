// stores/use-selected-school-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSelectedSchoolStore = create(
  persist(
    (set) => ({
      selectedSchoolId: null,
      setSelectedSchoolId: (id) => set({ selectedSchoolId: id }),
      clearSelectedSchoolId: () => set({ selectedSchoolId: null }),
    }),
    {
      name: "selected-school-store", // LocalStorage key
    }
  )
);
