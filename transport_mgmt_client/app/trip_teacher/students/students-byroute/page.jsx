"use client";

import React from "react";
import { useFetchStudentsByRoute } from "../queries/queries";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useCreateTripMessage } from "../../trip-messages/queries/mutation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

  if (isLoading)
    return <div className="text-center mt-12">Loading students...</div>;
  if (isError)
    return (
      <div className="text-center mt-12 text-red-500">
        Error loading students.
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-6">
      {ongoingTrip?.id && (
        <h3 className="text-base font-medium text-muted-foreground mb-4 text-center">
          Ongoing Trip ID: {ongoingTrip.id}
        </h3>
      )}

      <h2 className="text-xl font-semibold mb-6 text-center">
        Students on Route
      </h2>
      <ul className="space-y-3">
        {students?.map((student, index) => (
          <motion.li
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="p-3 border rounded-md flex items-center space-x-3"
          >
            {sent[student.id] ? (
              <span className="text-green-600 text-sm font-medium">Sent</span>
            ) : sending[student.id] ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Checkbox
                checked={false}
                onCheckedChange={(checked) => handleCheck(checked, student)}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {student.first_name} – {student.class_name}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsByRoute;
