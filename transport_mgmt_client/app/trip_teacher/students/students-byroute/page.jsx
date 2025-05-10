"use client";

import React from "react";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import StudentList from "../_components/student-list";
import EndTripButton from "../_components/end-trip-button";
import TripPopoverActions from "../_components/trip-popover";

const StudentsByRoute = () => {
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);

  return (
    <div className="max-w-md mx-auto p-6">
      {ongoingTrip?.id && (
        <h3 className="text-base font-medium text-muted-foreground mb-4 text-center">
          Ongoing Trip ID: {ongoingTrip.id}
        </h3>
      )}

      <h2 className="text-xl font-semibold mb-6 text-center">
        Students on Route
      </h2>

      <StudentList />
      {ongoingTrip?.id && <EndTripButton />}
      <TripPopoverActions />
    </div>
  );
};

export default StudentsByRoute;
