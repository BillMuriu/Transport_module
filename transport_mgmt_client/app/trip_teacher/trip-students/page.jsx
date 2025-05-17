"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "./queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import TripPopoverActions from "../students/_components/trip-popover";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useCreateArrivedMessage } from "../trip-messages/queries/mutation";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const TripStudents = () => {
  const routeId = "3d2da454-05bb-42bb-b96f-5c3e4d2b1cd8";
  const { data, isLoading, isError } = useStudentsByRoute(routeId);
  const { students, setStudents, resetStudents } = useStudentStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const updateTrip = useUpdateTrip();
  const createArrivedMessage = useCreateArrivedMessage();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

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

    setOpenBackdrop(true); // show loader

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);

    const updatedData = {
      ...ongoingTrip,
      expected_students,
      boarded_students,
    };

    updateTrip.mutate(
      {
        tripId: ongoingTrip.id,
        updatedData,
      },
      {
        onSuccess: () => {
          createArrivedMessage.mutate(
            {
              trip_id: ongoingTrip.id,
              student_ids: boarded_students,
            },
            {
              onSuccess: () => {
                router.push(`/trip_teacher/trips/summary/${ongoingTrip.id}`);
                // No need to hide the backdrop; redirect handles that
              },
              onError: () => {
                setOpenBackdrop(false);
                // Optionally show toast error
              },
            }
          );
        },
        onError: () => {
          setOpenBackdrop(false);
          // Optionally show toast error
        },
      }
    );
  };

  if (!ongoingTrip) {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">
          No ongoing trip available
        </h2>
        <p>Please start a trip to see the student list.</p>
      </div>
    );
  }

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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      ;
    </div>
  );
};

export default TripStudents;
