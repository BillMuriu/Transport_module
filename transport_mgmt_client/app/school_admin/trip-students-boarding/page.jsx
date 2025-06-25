"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "@/app/trip_teacher/trip-students/queries/queries";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { BoardingDataTable } from "@/app/trip_teacher/trip-students-boarding/_components/data-table";
import { columns } from "@/app/trip_teacher/trip-students-boarding/_components/columns";
import { useUpdateTrip } from "@/app/trip_teacher/trips/_queries/mutation";
import { useSendTripMessages } from "@/app/trip_teacher/trip-students/queries/mutations";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
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

    // Get IDs of students who have boarded
    const boarded_students = boardingStudents
      .filter((s) => s.boarded)
      .map((s) => s.id);

    // Directly navigate to dropoff phase
    router.push("/school_admin/trip-students-dropoff");
    setOpenBackdrop(false);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Header with Trip Info Accordion */}
        <div className="mb-8 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Evening Boarding
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 h-auto">
                  <span className="text-sm font-medium">
                    Boarded:{" "}
                    <span className="text-primary font-bold">
                      {boardingStudents.filter((s) => s.boarded).length}
                    </span>
                    {" / "}
                    <span className="text-foreground">
                      {boardingStudents.length}
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
                  <Bus className="h-5 w-5 text-primary/90 shrink-0" />
                  <span>View Trip Details & Instructions</span>
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Instructions
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Check students as they board the bus</p>
                      <p>2. Verify all expected students</p>
                      <p>3. Complete boarding when ready</p>
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
            <BoardingDataTable columns={columns} data={boardingStudents} />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 py-4 bg-background border-t border-border mt-6">
          <div className="container mx-auto max-w-[1400px] flex justify-end">
            <Button size="lg" onClick={handleCompleteBoardingPhase}>
              Complete Boarding Phase
            </Button>
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
}
