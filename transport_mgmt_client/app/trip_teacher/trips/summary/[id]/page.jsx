"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTripById } from "../../_queries/queries";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useStudentStore } from "@/stores/useStudentStore";

export default function TripSummaryPage() {
  const [isDataProcessed, setIsDataProcessed] = useState(false);

  const params = useParams();
  const tripId = params.id; // Get trip ID from URL parameters

  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );
  const resetStudents = useStudentStore((state) => state.resetStudents);

  const { data: trip, isLoading, isError, isSuccess } = useTripById(tripId);

  // Wait for data to be completely fetched and processed before clearing stores
  useEffect(() => {
    if (isSuccess && trip && !isDataProcessed) {
      // Mark data as processed to prevent multiple clears
      setIsDataProcessed(true);

      // Clear stores after data is successfully loaded
      setTimeout(() => {
        clearOngoingTrip();
        resetStudents();
      }, 100); // Small delay to ensure UI has rendered with the data
    }
  }, [isSuccess, trip, isDataProcessed, clearOngoingTrip, resetStudents]);

  // Reset the processed flag when tripId changes
  useEffect(() => {
    setIsDataProcessed(false);
  }, [tripId]);

  if (!tripId) return <div>No trip ID provided.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !trip) return <div>Trip not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trip Summary</h1>
      <p>Trip ID: {tripId}</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(trip, null, 2)}
      </pre>
    </div>
  );
}
