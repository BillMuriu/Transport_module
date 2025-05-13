import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStudentStore = create(
  persist(
    (set) => ({
      students: [],
      setStudents: (students) => set({ students }),
      resetStudents: () => set({ students: [] }),
    }),
    {
      name: "student-storage",
    }
  )
);
