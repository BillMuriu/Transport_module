import { useSendTripMessages } from "./queries/mutations";

export const useSendMessages = (tripId, selectedStudents, setStudents) => {
  const { mutate: sendMessagesToParents, isPending } = useSendTripMessages();

  const handleSendMessages = () => {
    if (!tripId) return;

    const studentIds = selectedStudents.map((s) => s.id);

    sendMessagesToParents(
      {
        tripId,
        studentIds,
      },
      {
        onSuccess: () => {
          const updatedStudents = selectedStudents.map((student) => ({
            ...student,
            sent: true,
          }));

          setStudents((prevStudents) =>
            prevStudents.map(
              (student) =>
                updatedStudents.find((s) => s.id === student.id) || student
            )
          );
          console.log("Message sent successfully to students:", studentIds);
        },
        onError: (error) => {
          console.error("Error sending messages:", error);
        },
      }
    );
  };

  return { handleSendMessages, isPending };
};
