import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import React from "react";

const Trip = () => {
  return (
    <div className="w-full ml-2 bg-amber-200">
      <h1>Trips Page</h1>
      <p>- Ongoing Trip</p>
      <Button>
        <a
          href="/trip_teacher/trips/create"
          className="w-full flex gap-2 justify-between"
        >
          <PlusCircle />
          <span>Create New Trip</span>
        </a>
      </Button>
      <p>- Filters</p>
      <p>- List of Past Trips</p>
    </div>
  );
};

export default Trip;
