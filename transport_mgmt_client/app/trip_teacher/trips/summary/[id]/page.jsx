"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTripById } from "../../_queries/queries";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useStudentStore } from "@/stores/useStudentStore";

export default function TripSummaryPage() {
  const { id } = useParams();
  const { data: trip, isLoading, isError } = useTripById(id);

  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );
  const resetStudents = useStudentStore((state) => state.resetStudents);

  // Reset ongoingTrip and students once we successfully load trip data
  useEffect(() => {
    if (trip) {
      clearOngoingTrip();
      resetStudents();
    }
  }, [trip, clearOngoingTrip, resetStudents]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !trip) return <div>Trip not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trip Summary</h1>
      <p>Trip ID: {id}</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(trip, null, 2)}
      </pre>
    </div>
  );
}
