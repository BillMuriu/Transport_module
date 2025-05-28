"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRoutes } from "./services/queries";
import { columns } from "./_components/routes-columns";
import { RoutesDataTable } from "./_components/routes-data-table";

const Routes = () => {
  const { data, isLoading, isError } = useRoutes();

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
      <div className="flex justify-around items-center mb-10">
        <h1 className="text-2xl font-semibold">Routes</h1>
        <Button asChild>
          <a
            href="/school_admin/routes/add"
            className="flex gap-2 items-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Route</span>
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading routes...</span>
        </div>
      ) : isError ? (
        <div className="mt-16 text-center text-red-500">
          Failed to load routes.
        </div>
      ) : (
        <div className="mt-6">
          <RoutesDataTable columns={columns} data={data?.results || []} />
        </div>
      )}
    </div>
  );
};

export default Routes;
