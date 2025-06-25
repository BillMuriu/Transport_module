"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useUpdateStudentBoarding } from "@/app/trip_teacher/trip-students/_queries/mutation";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "parent_name",
    header: "Parent Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("parent_name")}</div>
    ),
  },
  {
    accessorKey: "station_name",
    header: "Station",
    cell: ({ row }) => <div>{row.getValue("station_name")}</div>,
  },
  {
    accessorKey: "boarding_status",
    header: "Boarding Status",
    cell: ({ row }) => {
      const status = row.getValue("boarding_status");

      return (
        <Badge variant={status === "boarded" ? "success" : "secondary"}>
          {status === "boarded" ? "Boarded" : "Not Boarded"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const setStudentBoarding = useBoardingStudentsStore(
        (state) => state.setStudentBoarding
      );
      const { mutate: updateStudentBoarding } = useUpdateStudentBoarding();

      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newStatus =
              student.boarding_status === "boarded" ? "not_boarded" : "boarded";
            setStudentBoarding(student.id, newStatus);
            updateStudentBoarding({
              studentId: student.id,
              status: newStatus,
            });
          }}
        >
          {student.boarding_status === "boarded"
            ? "Mark Not Boarded"
            : "Mark as Boarded"}
        </Button>
      );
    },
  },
];
