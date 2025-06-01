"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTripById } from "../../_queries/queries";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useStudentStore } from "@/stores/useStudentStore";
import { format } from "date-fns";

export default function TripSummaryPage() {
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const params = useParams();
  const tripId = params.id;

  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );
  const resetStudents = useStudentStore((state) => state.resetStudents);

  const { data: trip, isLoading, isError, isSuccess } = useTripById(tripId);

  useEffect(() => {
    if (isSuccess && trip && !isDataProcessed) {
      setIsDataProcessed(true);
      setTimeout(() => {
        clearOngoingTrip();
        resetStudents();
      }, 100);
    }
  }, [isSuccess, trip, isDataProcessed, clearOngoingTrip, resetStudents]);

  useEffect(() => {
    setIsDataProcessed(false);
  }, [tripId]);

  if (!tripId) return <div>No trip ID provided.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !trip) return <div>Trip not found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Trip Summary</h1>

      {/* Basic Info */}
      <section className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <p className="text-sm text-gray-500">Trip Name</p>
          <p className="font-medium">{trip.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Trip Type</p>
          <p className="font-medium capitalize">
            {trip.trip_type.replace("_", " ")}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Start Location</p>
          <p className="font-medium">{trip.start_location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Location</p>
          <p className="font-medium">{trip.end_location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Departure Time</p>
          <p className="font-medium">
            {trip.departure_time
              ? format(new Date(trip.departure_time), "Pp")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Arrival Time</p>
          <p className="font-medium">
            {trip.arrival_time
              ? format(new Date(trip.arrival_time), "Pp")
              : "Pending"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Trip Status</p>
          <p className="font-medium capitalize">{trip.trip_status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Trip Action</p>
          <p className="font-medium capitalize">{trip.trip_action}</p>
        </div>
      </section>

      {/* Participants */}
      <section className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">
        <div>
          <p className="text-sm text-gray-500">Driver</p>
          <p
            className="font-mono text-sm truncate max-w-xs"
            title={trip.driver_name ?? ""}
          >
            {trip.driver_name ?? trip.driver ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Trip Teacher</p>
          <p
            className="font-mono text-sm truncate max-w-xs"
            title={trip.trip_teacher_name ?? ""}
          >
            {trip.trip_teacher_name ?? trip.trip_teacher ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vehicle</p>
          <p
            className="font-mono text-sm truncate max-w-xs"
            title={trip.vehicle_name ?? ""}
          >
            {trip.vehicle_name ?? trip.vehicle ?? "N/A"}
          </p>
        </div>
      </section>

      {/* Students Summary */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Students</h2>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-500">Expected</p>
            <p className="text-xl font-bold">{trip.expected_students.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Boarded</p>
            <p className="text-xl font-bold text-green-600">
              {trip.boarded_students.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-xl font-bold text-red-600">
              {trip.expected_students.length - trip.boarded_students.length}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
