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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Header with Trip Info Accordion */}
        <div className="mb-8 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Evening Dropoff
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 h-auto">
                  <span className="text-sm font-medium">
                    Alighted:{" "}
                    <span className="text-primary font-bold">
                      {boardingStudents.filter((s) => s.alighted).length}
                    </span>
                    {" / "}
                    <span className="text-foreground">
                      {boardingStudents.filter((s) => s.boarded).length}
                    </span>
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          <Accordion
            type="single"
            collapsible
            className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
          >
            <AccordionItem value="trip-info" className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 bg-primary/5 border-b border-border">
                <span className="flex items-center gap-2">
                  View Trip Details & Instructions
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Trip Details
                    </h3>
                    <div className="space-y-2 text-sm">
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

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Student Status
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Expected:{" "}
                        <span className="text-foreground">
                          {boardingStudents.length}
                        </span>
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

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Instructions
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Check students as they alight from the bus</p>
                      <p>2. Verify all students have been dropped off</p>
                      <p>3. End trip when completed</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Main Content - Table */}
        <div className="bg-card shadow-sm rounded-lg border border-border">
          <div className="p-4 sm:p-6">
            <DropoffDataTable columns={columns} data={boardedStudents} />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 py-4 bg-background border-t border-border mt-6">
          <div className="container mx-auto max-w-[1400px]">
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
