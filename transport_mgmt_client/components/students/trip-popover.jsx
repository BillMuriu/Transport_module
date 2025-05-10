"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TripPopoverActions = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger className="w-12 h-12 bg-foreground/80 text-white rounded-full flex items-center justify-center shadow-md border border-white/10 hover:bg-black/70 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4 mr-4 mt-10 bg-foreground shadow-lg rounded-lg flex flex-col gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">Cancel Trip</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this trip?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cancelling now will discard all current trip data. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
                  Confirm Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full bg-background text-foreground border border-border"
              >
                End Trip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to end the trip?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>You’re about to end the trip.</p>
                  <p>
                    Parents of the <span className="font-semibold">10</span>{" "}
                    students who boarded will be notified that their children
                    have arrived safely.
                  </p>
                  <p>
                    Parents of the <span className="font-semibold">20</span>{" "}
                    students who did not board will be informed that their
                    children did not take the trip.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-primary text-white hover:bg-primary/90">
                  Confirm End Trip
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TripPopoverActions;
