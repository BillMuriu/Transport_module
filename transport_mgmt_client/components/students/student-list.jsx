import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteStudentsByRoute } from "@/app/trip_teacher/students/queries/queries";
import { useSendTripMessage } from "@/app/trip_teacher/students/useSendTrip";
import StudentItem from "./student-item";

const routeId = "7ee67271-a068-4ba9-ac75-5a83e88b732c";

const StudentList = () => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteStudentsByRoute(routeId);
  const { handleCheck, sending, sent, setStudentsNotSent } =
    useSendTripMessage();

  useEffect(() => {
    if (data?.pages) {
      const allStudents = data.pages.flatMap((page) => page.results);
      const notSentIds = allStudents
        .filter((student) => !sent[student.id])
        .map((student) => student.id);
      setStudentsNotSent(notSentIds);
    }
  }, [data, sent]);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  if (!data) return <div>Loading...</div>;

  return (
    <ul className="space-y-3">
      {data.pages.map((page) =>
        page.results.map((student, index) => (
          <StudentItem
            key={student.id}
            student={student}
            index={index}
            onCheck={handleCheck}
            sending={sending[student.id]}
            sent={sent[student.id]}
          />
        ))
      )}
      <div ref={ref} className="h-8" />
      {isFetchingNextPage && <p className="text-center">Loading more...</p>}
    </ul>
  );
};

export default StudentList;
