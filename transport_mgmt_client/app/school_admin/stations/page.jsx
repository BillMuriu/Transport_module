"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useStations } from "./services/queries";
import { columns } from "./_components/stations-columns";
import { StationsDataTable } from "./_components/stations-data-table";

const Stations = () => {
  const { data, isLoading, isError } = useStations();

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
      <div className="flex justify-start items-center mb-4">
        <Button asChild>
          <a
            href="/school_admin/stations/add"
            className="flex gap-2 items-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Station</span>
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading stations...
          </span>
        </div>
      ) : isError ? (
        <div className="mt-16 text-center text-red-500">
          Failed to load stations.
        </div>
      ) : (
        <div className="mt-6">
          <StationsDataTable columns={columns} data={data.results} />
        </div>
      )}
    </div>
  );
};

export default Stations;
