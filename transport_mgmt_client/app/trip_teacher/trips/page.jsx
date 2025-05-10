import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import React from "react";

const Trip = () => {
  return (
    <div className="w-full ml-2 mt-4 flex items-center justify-center">
      <Button>
        <a
          href="/trip_teacher/trips/create"
          className="w-full flex gap-2 justify-between"
        >
          <PlusCircle />
          <span>Create New Trip</span>
        </a>
      </Button>
    </div>
  );
};

export default Trip;
