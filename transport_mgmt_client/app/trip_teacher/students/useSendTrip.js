import { toast } from "sonner";
import { useState } from "react";
import { useCreateTripMessage } from "../trip-messages/queries/mutation";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";

export function useSendTripMessage() {
  const ongoingTrip = useOngoingTripStore((s) => s.ongoingTrip);
  const { mutate: sendTripMessage } = useCreateTripMessage();

  const [sending, setSending] = useState({});
  const [sent, setSent] = useState({});
  const [studentsNotSent, setStudentsNotSent] = useState([]);

  const handleCheck = (checked, student) => {
    if (checked && !sent[student.id] && ongoingTrip?.id) {
      setSending((prev) => ({ ...prev, [student.id]: true }));

      sendTripMessage(
        { student_id: student.id, trip_id: ongoingTrip.id },
        {
          onSuccess: () => {
            setSent((prev) => ({ ...prev, [student.id]: true }));
            setStudentsNotSent((prev) =>
              prev.filter((id) => id !== student.id)
            );
            toast.success(
              `Message for ${student.first_name} sent successfully.`
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

  return { handleCheck, sending, sent, studentsNotSent, setStudentsNotSent };
}
