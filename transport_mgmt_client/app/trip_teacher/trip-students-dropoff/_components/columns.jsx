"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";

export const columns = [
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
        className="mx-auto"
      />
    ),
    cell: ({ row }) => {
      const student = row.original;
      const updateAlightedStatus = useBoardingStudentsStore(
        (state) => state.updateAlightedStatus
      );

      return (
        <Checkbox
          checked={student.alighted}
          onCheckedChange={() => updateAlightedStatus(student.id)}
          aria-label="Select row"
          disabled={student.alighted}
          className="mx-auto"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    id: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;
      const updateAlightedStatus = useBoardingStudentsStore(
        (state) => state.updateAlightedStatus
      );
      return (
        <button
          onClick={() => updateAlightedStatus(row.original.id)}
          disabled={row.original.alighted}
          className="hover:text-blue-600 truncate text-left w-full"
        >
          {`${firstName} ${lastName}`}
        </button>
      );
    },
    filterFn: (row, _columnId, filterValue) => {
      const fullName =
        `${row.original.first_name} ${row.original.last_name}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
    size: 160,
  },
  {
    accessorKey: "Grade",
    header: () => <span>Grade</span>,
    cell: ({ row }) => <span>{row.getValue("Grade")}</span>,
    size: 80,
  },
  {
    id: "status",
    accessorFn: (row) => row.alighted,
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isAlighted = row.getValue("status");
      return (
        <Badge
          className={
            isAlighted
              ? "bg-green-100 text-green-800 border-green-200 text-xs"
              : "bg-red-50 text-red-800 border-red-200 text-xs"
          }
          variant="outline"
        >
          {isAlighted ? "Alighted" : "Not Alighted"}
        </Badge>
      );
    },
    size: 100,
  },
];
