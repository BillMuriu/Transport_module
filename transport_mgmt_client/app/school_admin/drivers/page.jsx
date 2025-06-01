"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useDrivers } from "./services/queries";
import { driverColumns } from "./_components/drivers-data-table";
import { DriversDataTable } from "./_components/drivers-columns";

const Drivers = () => {
  const { data, isLoading, isError } = useDrivers();

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
      <div className="flex justify-start items-center mb-4">
        <Button asChild>
          <a
            href="/school_admin/drivers/add"
            className="flex gap-2 items-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Driver</span>
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading drivers...</span>
        </div>
      ) : isError ? (
        <div className="mt-16 text-center text-red-500">
          Failed to load drivers.
        </div>
      ) : (
        <div className="mt-6">
          <DriversDataTable columns={driverColumns} data={data} />
        </div>
      )}
    </div>
  );
};

export default Drivers;
