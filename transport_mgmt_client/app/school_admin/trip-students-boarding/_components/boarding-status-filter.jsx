"use client";

import { Button } from "@/components/ui/button";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";

export function BoardingStatusFilter() {
  const filter = useBoardingStudentsStore((state) => state.filter);
  const setFilter = useBoardingStudentsStore((state) => state.setFilter);

  return (
    <div className="flex gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "boarded" ? "default" : "outline"}
        onClick={() => setFilter("boarded")}
      >
        Boarded
      </Button>
      <Button
        variant={filter === "not_boarded" ? "default" : "outline"}
        onClick={() => setFilter("not_boarded")}
      >
        Not Boarded
      </Button>
    </div>
  );
}
