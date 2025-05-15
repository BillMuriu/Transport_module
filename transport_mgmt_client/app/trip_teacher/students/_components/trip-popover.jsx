"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
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

const iconBaseClasses =
  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out";

const TripPopoverActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed mb-2 bottom-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="relative w-12 h-12 backdrop-blur bg-foreground/80 text-white rounded-full flex items-center justify-center shadow-md border border-white/10 hover:bg-black/70 transition-colors"
            aria-label={open ? "Close actions" : "Open actions"}
          >
            <MoreHorizontal
              className={`${iconBaseClasses} ${
                open ? "opacity-0 scale-50" : "opacity-100 scale-100"
              }`}
              aria-hidden={open}
            />
            <X
              className={`${iconBaseClasses} ${
                open ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
              aria-hidden={!open}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4 mr-4 mt-10 backdrop-blur bg-foreground/80 shadow-lg rounded-lg flex flex-col gap-2">
          {/* ... AlertDialogs unchanged */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full rounded-sm">Cancel Trip</Button>
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
