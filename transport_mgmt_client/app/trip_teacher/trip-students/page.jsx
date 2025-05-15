"use client";

import React, { useEffect } from "react";
import { useStudentsByRoute } from "./queries/queries";
import { useStudentStore } from "@/stores/useStudentStore";
import { DataTable } from "./_components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import TripPopoverActions from "../students/_components/trip-popover";

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
        <div className="px-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => {
        const isSent = row.original.sent;
        return (
          <div className="px-4">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              disabled={isSent}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 60,
    },
    {
      id: "name",
      header: () => <div className="px-4">Name</div>,
      cell: ({ row }) => {
        const firstName = row.original.first_name;
        const lastName = row.original.last_name;
        return <div className="px-4">{`${firstName} ${lastName}`}</div>;
      },
      filterFn: (row, _columnId, filterValue) => {
        const fullName =
          `${row.original.first_name} ${row.original.last_name}`.toLowerCase();
        return fullName.includes(filterValue.toLowerCase());
      },
      size: 200,
    },
    {
      accessorKey: "Grade",
      header: () => <div className="px-4">Grade</div>,
      cell: ({ row }) => <div className="px-4">{row.getValue("Grade")}</div>,
      size: 120,
    },
    {
      accessorKey: "sent",
      header: () => <div className="px-4">Sent</div>,
      cell: ({ row }) => {
        const isSent = row.getValue("sent");
        return (
          <div className="px-4">
            <Badge
              className={
                isSent
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-muted text-muted-foreground border-muted"
              }
              variant="outline"
            >
              {isSent ? "✅ Sent" : "Not Sent"}
            </Badge>
          </div>
        );
      },
      size: 140,
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
      <TripPopoverActions />
    </div>
  );
};

export default TripStudents;
