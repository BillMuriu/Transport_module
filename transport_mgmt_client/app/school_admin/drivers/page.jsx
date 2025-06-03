"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useDrivers } from "./services/queries";
import { driverColumns } from "./_components/drivers-data-table";
import { DriversDataTable } from "./_components/drivers-columns";

const Drivers = () => {
  const { data, isLoading, isError } = useDrivers();

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
        {/* Header Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Drivers
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and view all registered drivers
              </p>
            </div>

            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm w-fit"
            >
              <a
                href="/school_admin/drivers/add"
                className="flex gap-2 items-center px-4 py-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Driver</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading drivers...
              </span>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="text-center">
              <div className="text-destructive text-lg font-medium mb-2">
                Failed to load drivers
              </div>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <DriversDataTable columns={driverColumns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
