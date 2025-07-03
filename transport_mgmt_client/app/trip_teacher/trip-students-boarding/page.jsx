"use client";

import React, { useEffect, useState } from "react";
import { useStudentsByRoute } from "../trip-students/queries/queries";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { BoardingDataTable } from "./_components/data-table";
import { createColumns } from "./_components/columns";
import { useUpdateTrip } from "../trips/_queries/mutation";
import { useSendTripMessages } from "../trip-students/queries/mutations";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  // State for managing delayed student transitions
  const [recentlyBoardedStudents, setRecentlyBoardedStudents] = useState(
    new Set()
  );

  // State for students showing "Boarded" feedback but not yet moved to boarded section
  const [pendingBoardingStudents, setPendingBoardingStudents] = useState(
    new Set()
  );

  // State for students that are fading out before moving to boarded section
  const [fadingOutStudents, setFadingOutStudents] = useState(new Set());

  // State for boarding completion popover
  const [boardingPopoverOpen, setBoardingPopoverOpen] = useState(false);

  // Get logged-in user info
  const user = useAuthStore((state) => state.user);
  const tripTeacherId = user?.id;

  const { data, isLoading, isError } = useStudentsByRoute(routeId, {
    enabled: !!routeId,
  });

  const updateTrip = useUpdateTrip();
  const sendMessages = useSendTripMessages();

  // Handle boarding with delayed transition
  const handleStudentBoarding = (studentId) => {
    // Phase 1: Show immediate visual feedback (Boarded ✅) without updating state
    setPendingBoardingStudents((prev) => new Set([...prev, studentId]));

    // Phase 2: After delay, start fade out animation
    setTimeout(() => {
      setFadingOutStudents((prev) => new Set([...prev, studentId]));

      // Phase 3: After fade animation, update state and move student
      setTimeout(() => {
        // Update the actual boarding status
        updateBoardingStatus(studentId);

        // Remove from pending and fading states
        setPendingBoardingStudents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(studentId);
          return newSet;
        });

        setFadingOutStudents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(studentId);
          return newSet;
        });

        // Add to recently boarded for keeping in current section briefly
        setRecentlyBoardedStudents((prev) => new Set([...prev, studentId]));

        // After another short delay, move to boarded section
        setTimeout(() => {
          setRecentlyBoardedStudents((prev) => {
            const newSet = new Set(prev);
            newSet.delete(studentId);
            return newSet;
          });
        }, 500); // Shorter delay for the actual move
      }, 300); // Wait for fade animation to complete
    }, 1000); // 1 second delay for visual feedback
  };

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

    // // Send messages to parents of boarded students - Temporarily disabled
    // sendMessages.mutate(
    //   {
    //     tripId: ongoingTrip.id,
    //     studentIds: boarded_students,
    //   },
    //   {
    //     onSuccess: () => {
    //       router.push("/trip_teacher/trip-students-dropoff");
    //     },
    //     onError: () => {
    //       setOpenBackdrop(false);
    //     },
    //   }
    // );

    // Directly navigate to dropoff phase
    router.push("/trip_teacher/trip-students-dropoff");
    setOpenBackdrop(false);
  };

  // Handle boarding phase completion with message sending
  const handleCompleteBoardingWithMessage = () => {
    setBoardingPopoverOpen(false);
    // TODO: Add message sending functionality
    handleCompleteBoardingPhase();
  };

  // Handle boarding phase completion without message sending
  const handleCompleteBoardingWithoutMessage = () => {
    setBoardingPopoverOpen(false);
    handleCompleteBoardingPhase();
  };

  // Handle cancel boarding completion
  const handleCancelBoardingCompletion = () => {
    setBoardingPopoverOpen(false);
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
            <BoardingDataTable
              columns={createColumns}
              data={boardingStudents}
              onStudentBoard={handleStudentBoarding}
              recentlyBoardedStudents={recentlyBoardedStudents}
              pendingBoardingStudents={pendingBoardingStudents}
            />
          </div>
        </div>

        {/* Add bottom padding to prevent content from being hidden behind floating bar */}
        <div className="h-20"></div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 z-40 left-1/2 transform -translate-x-1/2 w-full max-w-[1400px] mx-auto px-4">
        <div className="border-t border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
          <div className="flex justify-center py-4 px-4">
            <Popover
              open={boardingPopoverOpen}
              onOpenChange={setBoardingPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button size="lg" className="shadow-lg">
                  Complete Boarding Phase
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 mb-4 backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/90 shadow-lg rounded-lg border border-border/30">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Complete Boarding Phase
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {boardingStudents.filter((s) => s.boarded).length}{" "}
                      students have boarded. Choose how to proceed to the
                      dropoff phase.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Send departure message and continue */}
                    <Button
                      className="w-full justify-start text-left h-auto py-3 px-4"
                      onClick={handleCompleteBoardingWithMessage}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          Send Departure Message & Continue
                        </div>
                        <div className="text-xs opacity-80">
                          Notify parents that students have departed
                        </div>
                      </div>
                    </Button>

                    {/* Continue without sending message */}
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 bg-background text-foreground border border-border hover:bg-muted"
                      onClick={handleCompleteBoardingWithoutMessage}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          Continue Without Message
                        </div>
                        <div className="text-xs opacity-70">
                          Proceed to dropoff without notifications
                        </div>
                      </div>
                    </Button>

                    {/* Cancel */}
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={handleCancelBoardingCompletion}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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

export default TripStudentsBoarding;
