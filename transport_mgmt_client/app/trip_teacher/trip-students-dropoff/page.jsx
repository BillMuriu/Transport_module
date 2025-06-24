"use client";

import React, { useState, useEffect } from "react";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DropoffDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import TripPopoverActions from "../students/_components/trip-popover";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const TripStudentsDropoff = () => {
  const { boardingStudents, resetBoardingStudents } =
    useBoardingStudentsStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const updateTrip = useUpdateTrip();
  // Filter to show only boarded students
  const boardedStudents = boardingStudents.filter((student) => student.boarded);

  useEffect(() => {
    // Only redirect if there's no ongoing trip or if it's not the right type
    if (ongoingTrip && ongoingTrip.trip_type !== "evening_dropoff") {
      router.push("/trip_teacher/trips");
    }
  }, [ongoingTrip, router]);
  const handleEndTrip = () => {
    if (!ongoingTrip) return;

    setOpenBackdrop(true);

    const expected_students = boardingStudents.map((s) => s.id);
    const boarded_students = boardingStudents
      .filter((s) => s.boarded)
      .map((s) => s.id);
    const alighted_students = boardingStudents
      .filter((s) => s.boarded && s.alighted)
      .map((s) => s.id);

    // Store the trip ID before clearing the store
    const tripId = ongoingTrip.id;

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
          // Clear stores before navigation
          clearOngoingTrip();
          resetBoardingStudents();
          // Navigate to summary page using stored tripId
          router.push(`/trip_teacher/trips/summary/${tripId}`);
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

    const expected_students = boardingStudents.map((s) => s.id);
    const boarded_students = boardingStudents
      .filter((s) => s.boarded)
      .map((s) => s.id);
    const alighted_students = boardingStudents
      .filter((s) => s.boarded && s.alighted)
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
          resetBoardingStudents();
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No ongoing trip available
          </h2>
          <p className="text-muted-foreground">
            Please start a trip to see the student list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Evening Dropoff
          </h1>
          <p className="text-muted-foreground">
            Track and manage student dropoffs for the evening trip
          </p>
        </div>

        {/* Trip Info Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-2">Trip Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Trip Name:{" "}
                <span className="text-foreground">{ongoingTrip.name}</span>
              </p>
              <p className="text-muted-foreground">
                Route:{" "}
                <span className="text-foreground">
                  {ongoingTrip.route_name || "Not specified"}
                </span>
              </p>
              <p className="text-muted-foreground">
                Vehicle:{" "}
                <span className="text-foreground">
                  {ongoingTrip.vehicle_name || "Not specified"}
                </span>
              </p>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-2">
              Student Status
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Expected Students:{" "}
                <span className="text-foreground">{boardingStudents.length}</span>
              </p>
              <p className="text-muted-foreground">
                Boarded:{" "}
                <span className="text-primary">
                  {boardingStudents.filter((s) => s.boarded).length}
                </span>
              </p>
              <p className="text-muted-foreground">
                Alighted:{" "}
                <span className="text-primary">
                  {boardingStudents.filter((s) => s.alighted).length}
                </span>
              </p>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-sm border border-border md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-2">Instructions</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Check students as they alight from the bus</p>
              <p>2. Verify all students have been dropped off</p>
              <p>3. End trip when completed</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-6 bg-primary/5 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Student Dropoff Tracking
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Only students who boarded the bus are shown below. Mark each student
              as they alight at their stop.
            </p>
          </div>

          <div className="p-6">
            <DropoffDataTable columns={columns} data={boardedStudents} />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 py-4 bg-background border-t border-border mt-auto">
          <div className="container mx-auto px-4 max-w-7xl">
            <TripPopoverActions
              onEndTrip={handleEndTrip}
              onCancelTrip={handleCancelTrip}
            />
          </div>
        </div>
      </div>

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
