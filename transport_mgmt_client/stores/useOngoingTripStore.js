import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOngoingTripStore = create(
  persist(
    (set) => ({
      ongoingTrip: null,
      setOngoingTrip: (trip) => set({ ongoingTrip: trip }),
      clearOngoingTrip: () => set({ ongoingTrip: null }),
    }),
    {
      name: "ongoing-trip-storage", // localStorage key
      partialize: (state) => ({ ongoingTrip: state.ongoingTrip }), // only persist what you need
    }
  )
);
