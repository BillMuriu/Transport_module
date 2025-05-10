import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStudentMessageStatusStore = create(
  persist(
    (set) => ({
      sent: {}, // { [studentId]: true }
      studentsNotSent: [], // [studentId, ...]

      setStudentMessageStatus: ({ sent, studentsNotSent }) =>
        set({ sent, studentsNotSent }),

      clearStudentMessageStatus: () => set({ sent: {}, studentsNotSent: [] }),
    }),
    {
      name: "student-message-status-storage",
      partialize: (state) => ({
        sent: state.sent,
        studentsNotSent: state.studentsNotSent,
      }),
    }
  )
);
