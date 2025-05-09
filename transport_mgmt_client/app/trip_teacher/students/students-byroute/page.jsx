"use client";

import React from "react";
import { useFetchStudentsByRoute } from "../queries/queries";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";

const routeId = "7ee67271-a068-4ba9-ac75-5a83e88b732c"; // Replace with dynamic routeId if needed

const StudentsByRoute = () => {
  // Subscribe to the ongoing trip state from the Zustand store
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);

  const {
    data: students,
    isLoading,
    isError,
  } = useFetchStudentsByRoute(routeId);

  const [selected, setSelected] = React.useState([]);

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Error loading students.</div>;

  const handleCheck = (checked, student) => {
    if (checked && !selected.includes(student.id)) {
      setSelected((prev) => [...prev, student.id]);

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify({ student: student.first_name, checked }, null, 2)}
          </code>
        </pre>
      );
    }
  };

  return (
    <div>
      {/* Show the trip ID at the top if it's available */}
      {ongoingTrip?.id && (
        <h3 className="text-xl font-semibold mb-4">
          Ongoing Trip ID: {ongoingTrip.id}
        </h3>
      )}

      <h2 className="text-xl font-semibold mb-4">Students on Route</h2>
      <ul className="space-y-2">
        {students?.map((student) => (
          <li
            key={student.id}
            className="p-2 border rounded flex items-center space-x-3"
          >
            <Checkbox
              checked={selected.includes(student.id)}
              disabled={selected.includes(student.id)}
              onCheckedChange={(checked) => handleCheck(checked, student)}
            />
            <span>
              {student.first_name} – {student.class_name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsByRoute;
