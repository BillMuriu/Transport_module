import { useSendTripMessages } from "./queries/mutations";

export const useSendMessages = (tripId, selectedStudents, setStudents) => {
  const { mutate: sendMessagesToParents, isPending } = useSendTripMessages();

  const handleSendMessages = () => {
    if (!tripId) return;

    const phoneNumbers = selectedStudents.map((s) => s.parent_phone);

    sendMessagesToParents(
      {
        tripId,
        phoneNumbers,
      },
      {
        onSuccess: () => {
          // If the message is successfully sent, update the 'sent' state
          const updatedStudents = selectedStudents.map((student) => ({
            ...student,
            sent: true,
          }));

          // Update state with modified students
          setStudents((prevStudents) =>
            prevStudents.map(
              (student) =>
                updatedStudents.find((s) => s.id === student.id) || student
            )
          );
          console.log("Message sent successfully to:", phoneNumbers);
        },
        onError: (error) => {
          console.error("Error sending messages:", error);
          // Optionally handle the error by showing a toast or alert
        },
      }
    );
  };

  return { handleSendMessages, isPending };
};
