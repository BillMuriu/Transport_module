"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "@/app/trip_teacher/trip-students/queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "@/app/trip_teacher/trip-students/_components/data-table";
import { columns } from "@/app/trip_teacher/trip-students/_components/columns";
import TripPopoverActions from "@/app/trip_teacher/students/_components/trip-popover";
import { useUpdateTrip } from "@/app/trip_teacher/trips/_queries/mutation";
import { useCreateArrivedMessage } from "@/app/trip_teacher/trip-messages/queries/mutation";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const TripStudents = () => {
  const routeId = "3d2da454-05bb-42bb-b96f-5c3e4d2b1cd8";
  const { data, isLoading, isError } = useStudentsByRoute(routeId);
  const { students, setStudents, resetStudents } = useStudentStore();

  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );

  const updateTrip = useUpdateTrip();
  const createArrivedMessage = useCreateArrivedMessage();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Get logged-in user info
  const user = useAuthStore((state) => state.user);
  const tripTeacherId = user?.id;

  // Initialize students list from data fetched
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

  // Log ongoingTrip state whenever it changes
  useEffect(() => {
    if (ongoingTrip) {
      console.log("🧭 ongoingTrip structure:", ongoingTrip);
    } else {
      console.log("🛑 No ongoing trip found.");
    }
  }, [ongoingTrip]);

  // Handle ending the trip
  const handleEndTrip = () => {
    if (!ongoingTrip) return;

    setOpenBackdrop(true); // Show loading spinner

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);

    // Store the trip ID before clearing the store
    const tripId = ongoingTrip.id;

    const updatedData = {
      ...ongoingTrip,
      trip_teacher: tripTeacherId,
      trip_status: "completed",
      expected_students,
      boarded_students,
    };

    console.log("🚨 Final data sent to updateTrip:", {
      tripId: ongoingTrip.id,
      updatedData,
    });

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
                // Clear stores before navigation
                clearOngoingTrip();
                resetStudents();
                // Use stored trip ID for navigation
                router.push(`/school_admin/trips/summary/${tripId}`);
              },
              onError: () => {
                setOpenBackdrop(false);
              },
            }
          );
        },
        onError: () => {
          setOpenBackdrop(false);
        },
      }
    );
  };

  // Handle cancelling the trip
  const handleCancelTrip = () => {
    if (!ongoingTrip) return;

    const expected_students = students.map((s) => s.id);
    const boarded_students = students.filter((s) => s.sent).map((s) => s.id);

    const updatedData = {
      ...ongoingTrip,
      expected_students,
      boarded_students,
      trip_teacher: tripTeacherId,
      trip_status: "cancelled",
    };

    updateTrip.mutate(
      {
        tripId: ongoingTrip.id,
        updatedData,
      },
      {
        onSuccess: () => {
          // Clear stores after successful cancellation
          clearOngoingTrip();
          resetStudents();
          router.push(`/school_admin/trips/summary/${tripId}`);
        },
        onError: (error) => {
          console.error("Failed to cancel trip:", error);
          // Optionally add toast/error UI here
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

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Failed to load students.</div>;

  return (
    <div>
      <DataTable columns={columns} data={students} setStudents={setStudents} />
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

export default TripStudents;
