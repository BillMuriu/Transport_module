"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "./queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import TripPopoverActions from "../students/_components/trip-popover";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useCreateArrivedMessage } from "../trip-messages/queries/mutation";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const TripStudents = () => {
  const { students, setStudents, resetStudents } = useStudentStore();

  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );

  // Get route ID from ongoing trip
  const routeId = ongoingTrip?.route;

  // Only fetch students if we have a route ID
  const { data, isLoading, isError } = useStudentsByRoute(routeId, {
    enabled: !!routeId, // Only run query if routeId exists
  });

  const updateTrip = useUpdateTrip();
  const createArrivedMessage = useCreateArrivedMessage();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Get logged-in user info
  const user = useAuthStore((state) => state.user);
  const tripTeacherId = user?.id;

  // Initialize students list from data fetched
  useEffect(() => {
    if (data) {
      const updated = data.map((student) => {
        const existing = students.find((s) => s.id === student.id);
        return {
          id: student.id,
          first_name: student.first_name,
          last_name: student.last_name,
          Grade: student.class_name,
          parent_phone: student.parent_phone,
          sent: existing ? existing.sent : false,
        };
      });

      setStudents(updated);
    }
  }, [data, setStudents, students.length]);

  // Log ongoingTrip state whenever it changes
  useEffect(() => {
    if (ongoingTrip) {
      console.log("🧭 ongoingTrip structure:", ongoingTrip);
      console.log("🛣️ Route ID from ongoing trip:", ongoingTrip.route);
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

    // Extract only the fields needed for the update, excluding id and metadata
    const updatedData = {
      name: ongoingTrip.name,
      trip_type: ongoingTrip.trip_type,
      trip_action: ongoingTrip.trip_action,
      trip_status: "completed",
      school: ongoingTrip.school,
      vehicle: ongoingTrip.vehicle,
      driver: ongoingTrip.driver,
      trip_teacher: tripTeacherId,
      route: ongoingTrip.route,
      start_location: ongoingTrip.start_location,
      end_location: ongoingTrip.end_location,
      departure_time: ongoingTrip.departure_time,
      arrival_time: ongoingTrip.arrival_time,
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
                router.push(`/trip_teacher/trips/summary/${tripId}`);
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

    // Extract only the fields needed for the update, excluding id and metadata
    const updatedData = {
      name: ongoingTrip.name,
      trip_type: ongoingTrip.trip_type,
      trip_action: ongoingTrip.trip_action,
      trip_status: "cancelled",
      school: ongoingTrip.school,
      vehicle: ongoingTrip.vehicle,
      driver: ongoingTrip.driver,
      trip_teacher: tripTeacherId,
      route: ongoingTrip.route,
      start_location: ongoingTrip.start_location,
      end_location: ongoingTrip.end_location,
      departure_time: ongoingTrip.departure_time,
      arrival_time: ongoingTrip.arrival_time,
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
          // Clear stores after successful cancellation
          clearOngoingTrip();
          resetStudents();
          router.push("/trip_teacher/trips");
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

  if (!routeId) {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">
          No route assigned to this trip
        </h2>
        <p>Please ensure the trip has a valid route assigned.</p>
      </div>
    );
  }

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Failed to load students.</div>;

  return (
    <div>
      {/* <Button var>Clear Trip</Button> */}
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
