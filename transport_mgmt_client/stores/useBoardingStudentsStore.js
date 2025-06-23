import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBoardingStudentsStore = create(
  persist(
    (set) => ({
      boardingStudents: [],
      setBoardingStudents: (boardingStudents) => set({ boardingStudents }),
      updateBoardingStatus: (studentId) =>
        set((state) => ({
          boardingStudents: state.boardingStudents.map((student) =>
            student.id === studentId
              ? { ...student, boarded: !student.boarded }
              : student
          ),
        })),      initializeBoardingStudents: (students) =>
        set((state) => ({
          boardingStudents: students.map((student) => {
            // Try to find existing student to preserve their boarding status
            const existingStudent = state.boardingStudents.find(
              (s) => s.id === student.id
            );
            return {
              ...student,
              // Keep existing boarding status if found, otherwise default to false
              boarded: existingStudent ? existingStudent.boarded : false,
            };
          }),
        })),
      resetBoardingStudents: () => set({ boardingStudents: [] }),
    }),
    {
      name: "boarding-students-storage",
    }
  )
);
