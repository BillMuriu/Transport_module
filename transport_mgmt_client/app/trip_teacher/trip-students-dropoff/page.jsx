"use client";

import React, { useEffect, useState } from "react";
import { useStudentStore } from "@/stores/useStudentStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "../trip-students/_components/data-table";
import { columns } from "../trip-students/_components/columns";
import TripPopoverActions from "../students/_components/trip-popover";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const TripStudentsDropoff = () => {
  const { students, setStudents, resetStudents } = useStudentStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const updateTrip = useUpdateTrip();

  // Filter to show only boarded students
  const boardedStudents = students.filter((student) => student.sent);

  useEffect(() => {
    // If there's no ongoing trip or no boarded students, redirect back
    if (!ongoingTrip || boardedStudents.length === 0) {
      router.push("/trip_teacher/trips");
    }
  }, [ongoingTrip, boardedStudents.length, router]);

  const handleEndTrip = () => {
    if (!ongoingTrip) return;

    setOpenBackdrop(true);

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);
    const alighted_students = students
      .filter((s) => s.sent && s.alighted)
      .map((s) => s.id);

    const updatedData = {
      name: ongoingTrip.name,
      trip_type: ongoingTrip.trip_type,
      trip_action: ongoingTrip.trip_action,
      trip_status: "completed",
      school: ongoingTrip.school,
      vehicle: ongoingTrip.vehicle,
      driver: ongoingTrip.driver,
      trip_teacher: user?.id,
      route: ongoingTrip.route,
      start_location: ongoingTrip.start_location,
      end_location: ongoingTrip.end_location,
      departure_time: ongoingTrip.departure_time,
      arrival_time: ongoingTrip.arrival_time,
      expected_students,
      boarded_students,
      alighted_students,
    };

    updateTrip.mutate(
      {
        tripId: ongoingTrip.id,
        updatedData,
      },
      {
        onSuccess: () => {
          clearOngoingTrip();
          resetStudents();
          router.push(`/trip_teacher/trips/summary/${ongoingTrip.id}`);
          setOpenBackdrop(false);
        },
        onError: () => {
          setOpenBackdrop(false);
        },
      }
    );
  };

  const handleCancelTrip = () => {
    if (!ongoingTrip) return;

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);
    const alighted_students = students
      .filter((s) => s.sent && s.alighted)
      .map((s) => s.id);

    const updatedData = {
      name: ongoingTrip.name,
      trip_type: ongoingTrip.trip_type,
      trip_action: ongoingTrip.trip_action,
      trip_status: "cancelled",
      school: ongoingTrip.school,
      vehicle: ongoingTrip.vehicle,
      driver: ongoingTrip.driver,
      trip_teacher: user?.id,
      route: ongoingTrip.route,
      start_location: ongoingTrip.start_location,
      end_location: ongoingTrip.end_location,
      departure_time: ongoingTrip.departure_time,
      arrival_time: ongoingTrip.arrival_time,
      expected_students,
      boarded_students,
      alighted_students,
    };

    updateTrip.mutate(
      {
        tripId: ongoingTrip.id,
        updatedData,
      },
      {
        onSuccess: () => {
          clearOngoingTrip();
          resetStudents();
          router.push("/trip_teacher/trips");
        },
        onError: (error) => {
          console.error("Failed to cancel trip:", error);
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

  return (
    <div>
      <div className="p-4 bg-blue-50 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Dropoff Phase
        </h2>
        <p className="text-blue-600">
          Mark students as they alight from the bus. Only students who boarded
          are shown.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={boardedStudents}
        setStudents={setStudents}
        isDropoffPhase={true}
      />
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
    </div>
  );
};

export default TripStudentsDropoff;
