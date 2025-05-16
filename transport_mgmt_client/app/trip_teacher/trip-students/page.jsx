"use client";

import React, { useEffect } from "react";
import { useStudentsByRoute } from "./queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import TripPopoverActions from "../students/_components/trip-popover";
import { useUpdateTrip } from "../trips/_queries/mutation";

const TripStudents = () => {
  const routeId = "3d2da454-05bb-42bb-b96f-5c3e4d2b1cd8";
  const { data, isLoading, isError } = useStudentsByRoute(routeId);
  const { students, setStudents, resetStudents } = useStudentStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const updateTrip = useUpdateTrip();

  useEffect(() => {
    if (data && students.length === 0) {
      const transformed = data.map((student) => ({
        first_name: student.first_name,
        last_name: student.last_name,
        id: student.id,
        Grade: student.class_name,
        parent_phone: student.parent_phone,
        sent: false,
      }));
      setStudents(transformed);
    }
  }, [data, students.length, setStudents]);

  const handleEndTrip = () => {
    if (!ongoingTrip) return;

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);

    const updatedData = {
      ...ongoingTrip,
      expected_students,
      boarded_students,
      // no change to trip_status here
    };

    updateTrip.mutate({
      tripId: ongoingTrip.id,
      updatedData,
    });
  };

  const handleCancelTrip = () => {
    if (!ongoingTrip) return;

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);

    const updatedData = {
      ...ongoingTrip,
      expected_students,
      boarded_students,
      trip_status: "cancelled", // set cancelled status here
    };

    updateTrip.mutate({
      tripId: ongoingTrip.id,
      updatedData,
    });
  };

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Failed to load students.</div>;

  return (
    <div>
      <h2>Trip Students</h2>
      <DataTable columns={columns} data={students} setStudents={setStudents} />

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => resetStudents()}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Reset Store
        </button>
      </div>

      <TripPopoverActions
        onEndTrip={handleEndTrip}
        onCancelTrip={handleCancelTrip}
      />
    </div>
  );
};

export default TripStudents;
