"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import { TripsDataTable } from "@/app/trip_teacher/trips/_components/trips-data-table";
import { tripsColumns } from "@/app/trip_teacher/trips/_components/trip-columns";
import { useTrips } from "@/app/trip_teacher/trips/_queries/queries";

const Trip = () => {
  const { data: tripsData = [], isLoading, isError } = useTrips();

  if (isLoading) {
    return <div className="text-center mt-20">Loading trips...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load trips.
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-md mx-auto mt-4 flex flex-col items-center px-4">
      <Button>
        <a
          href="/school_admin/trips/create"
          className="w-full flex gap-2 justify-between"
        >
          <PlusCircle />
          <span>Create New Trip</span>
        </a>
      </Button>

      <div className="mt-4 w-full">
        <TripsDataTable columns={tripsColumns} data={tripsData} />
      </div>
    </div>
  );
};

export default Trip;
