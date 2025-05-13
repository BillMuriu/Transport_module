"use client";

import React, { useEffect } from "react";
import { useStudentsByRoute } from "./queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { DataTable } from "./_components/data-table";
import { Checkbox } from "@/components/ui/checkbox";

const TripStudents = () => {
  const routeId = "3d2da454-05bb-42bb-b96f-5c3e4d2b1cd8";
  const { data, isLoading, isError } = useStudentsByRoute(routeId);
  const { students, setStudents, resetStudents } = useStudentStore();

  useEffect(() => {
    if (data && students.length === 0) {
      const transformed = data.map((student) => ({
        first_name: student.first_name,
        last_name: student.last_name,
        id: student.id,
        Grade: student.class_name,
        parent_phone: student.parent_phone,
        sent: false,
      }));
      setStudents(transformed);
    }
  }, [data, students.length, setStudents]);

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Failed to load students.</div>;

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "Grade",
      header: "Grade",
    },
    {
      accessorKey: "sent",
      header: "Sent",
      cell: ({ row }) => (row.getValue("sent") ? "Sent" : "Not Sent"),
    },
  ];

  return (
    <div>
      <h2>Trip Students</h2>
      <DataTable columns={columns} data={students} setStudents={setStudents} />
      <button
        onClick={() => resetStudents()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Reset Store
      </button>
    </div>
  );
};

export default TripStudents;
