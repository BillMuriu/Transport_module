"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "../trip-students/queries/queries";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { BoardingDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useSendTripMessages } from "../trip-students/queries/mutations";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";

const TripStudentsBoarding = () => {
  const {
    boardingStudents,
    setBoardingStudents,
    resetBoardingStudents,
    initializeBoardingStudents,
    updateBoardingStatus,
  } = useBoardingStudentsStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const routeId = ongoingTrip?.route;
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Get logged-in user info
  const user = useAuthStore((state) => state.user);
  const tripTeacherId = user?.id;

  const { data, isLoading, isError } = useStudentsByRoute(routeId, {
    enabled: !!routeId,
  });

  const updateTrip = useUpdateTrip();
  const sendMessages = useSendTripMessages();

  // Initialize students list from data fetched
  useEffect(() => {
    if (data) {
      const studentsWithBoardingStatus = data.map((student) => {
        const existing = boardingStudents.find((s) => s.id === student.id);
        return {
          id: student.id,
          first_name: student.first_name,
          last_name: student.last_name,
          Grade: student.class_name,
          parent_phone: student.parent_phone,
          boarded: existing ? existing.boarded : false,
        };
      });

      initializeBoardingStudents(studentsWithBoardingStatus);
    }
  }, [data, initializeBoardingStudents]);

  const handleCompleteBoardingPhase = () => {
    if (!ongoingTrip) return;

    setOpenBackdrop(true);

    const expected_students = boardingStudents.map((s) => s.id);
    const boarded_students = boardingStudents
      .filter((s) => s.boarded)
      .map((s) => s.id);

    const updatedData = {
      ...ongoingTrip,
      trip_status: "boarding_completed",
      expected_students,
      boarded_students,
    };

    // First update the trip status
    updateTrip.mutate(
      {
        tripId: ongoingTrip.id,
        updatedData,
      },
      {
        onSuccess: () => {
          // Then send messages to parents
          sendMessages.mutate(
            {
              tripId: ongoingTrip.id,
              studentIds: boarded_students,
            },
            {
              onSuccess: () => {
                router.push("/trip_teacher/trip-students-dropoff");
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

  if (ongoingTrip.trip_type !== "evening_dropoff") {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Invalid trip type</h2>
        <p>This page is only for evening dropoff trips.</p>
      </div>
    );
  }

  if (!routeId) {
    return (
      <div className="p-4 text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">No route assigned</h2>
        <p>Please ensure the trip has a valid route assigned.</p>
      </div>
    );
  }

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Failed to load students.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Evening Trip - Boarding Phase</h1>
        <Button
          onClick={handleCompleteBoardingPhase}
          disabled={!boardingStudents.some((s) => s.boarded)}
        >
          Complete Boarding
        </Button>
      </div>{" "}          <BoardingDataTable
            columns={columns}
            data={boardingStudents}
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

export default TripStudentsBoarding;
