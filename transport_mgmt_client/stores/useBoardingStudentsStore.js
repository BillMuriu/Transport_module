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
        })),
      updateAlightedStatus: (studentId) =>
        set((state) => ({
          boardingStudents: state.boardingStudents.map((student) =>
            student.id === studentId
              ? { ...student, alighted: !student.alighted }
              : student
          ),
        })),
      initializeBoardingStudents: (students) =>
        set((state) => ({
          boardingStudents: students.map((student) => {
            // Try to find existing student to preserve their status
            const existingStudent = state.boardingStudents.find(
              (s) => s.id === student.id
            );
            return {
              ...student,
              boarded: existingStudent ? existingStudent.boarded : false,
              alighted: existingStudent ? existingStudent.alighted : false,
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
