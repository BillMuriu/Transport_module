import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import React from "react";

const Trip = () => {
  return (
    <div className="w-full max-w-screen-md mx-auto mt-4 flex flex-col items-center px-4">
      <h1 className="mb-10">Trips Page...</h1>
      <Button>
        <a
          href="/trip_teacher/trips/create"
          className="w-full flex gap-2 justify-between"
        >
          <PlusCircle />
          <span>Create New Trip</span>
        </a>
      </Button>
      <div className="mt-16 w-full p-6 border-2 border-dashed border-gray-400 rounded-lg text-center text-muted-foreground">
        Trip content will appear here
      </div>
    </div>
  );
};

export default Trip;
