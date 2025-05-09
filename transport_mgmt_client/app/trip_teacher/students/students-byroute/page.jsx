"use client";

import React from "react";
import { useFetchStudentsByRoute } from "../queries/queries";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useCreateTripMessage } from "../../trip-messages/queries/mutation";
import { Loader2 } from "lucide-react";

const routeId = "7ee67271-a068-4ba9-ac75-5a83e88b732c";

const StudentsByRoute = () => {
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const { mutate: sendTripMessage } = useCreateTripMessage();

  const {
    data: students,
    isLoading,
    isError,
  } = useFetchStudentsByRoute(routeId);

  const [sending, setSending] = React.useState({});
  const [sent, setSent] = React.useState({});

  const handleCheck = (checked, student) => {
    if (checked && !sent[student.id] && ongoingTrip?.id) {
      setSending((prev) => ({ ...prev, [student.id]: true }));

      sendTripMessage(
        {
          student_id: student.id,
          trip_id: ongoingTrip.id,
        },
        {
          onSuccess: () => {
            setSent((prev) => ({ ...prev, [student.id]: true }));
            toast.success(
              `Message for ${student.first_name} was sent successfully.`
            );
          },
          onError: () => {
            toast.error(`Failed to send message for ${student.first_name}.`);
          },
          onSettled: () => {
            setSending((prev) => ({ ...prev, [student.id]: false }));
          },
        }
      );
    }
  };

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Error loading students.</div>;

  return (
    <div>
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
            {sent[student.id] ? (
              <span className="text-green-600 font-medium">Sent</span>
            ) : sending[student.id] ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Checkbox
                checked={false}
                onCheckedChange={(checked) => handleCheck(checked, student)}
              />
            )}
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
