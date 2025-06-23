"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
    cell: ({ row, table }) => {      const isBoarded = row.original.boarded;
      const updateBoardingStatus = useBoardingStudentsStore((state) => state.updateBoardingStatus);
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              updateBoardingStatus(row.original.id);
            }
          }}
          aria-label="Select row"
          disabled={isBoarded}
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
    header: () => <span>Name</span>,    cell: ({ row }) => {
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;
      const updateBoardingStatus = useBoardingStudentsStore((state) => state.updateBoardingStatus);
      return (
        <button
          onClick={() => {
            updateBoardingStatus(row.original.id);
          }}
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
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isBoarded = row.original.boarded;
      return (
        <Badge
          className={
            isBoarded
              ? "bg-green-100 text-green-800 border-green-200 text-xs"
              : "bg-yellow-50 text-yellow-800 border-yellow-200 text-xs"
          }
          variant="outline"
        >
          {isBoarded ? "Boarded" : "Yet to board"}
        </Badge>
      );
    },
    size: 100,
  },
];
