"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBoardingStudentsStore } from "@/stores/useBoardingStudentsStore";

export const createColumns = (
  onStudentBoard,
  recentlyBoardedStudents,
  pendingBoardingStudents,
  setFadingOutStudents
) => [
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
    cell: ({ row, table }) => {
      const isBoarded = row.original.boarded;
      const isPendingBoarding = pendingBoardingStudents?.has(row.original.id);

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value && !isBoarded && !isPendingBoarding) {
              onStudentBoard?.(row.original.id);
            }
          }}
          aria-label="Select row"
          disabled={isBoarded || isPendingBoarding}
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
      const isPendingBoarding = pendingBoardingStudents?.has(row.original.id);

      return (
        <button
          onClick={() => {
            if (!row.original.boarded && !isPendingBoarding) {
              onStudentBoard?.(row.original.id);
            }
          }}
          className="hover:text-blue-600 truncate text-left w-full disabled:cursor-default"
          disabled={row.original.boarded || isPendingBoarding}
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
    accessorFn: (row) => row.boarded,
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isBoarded = row.getValue("status");
      const isRecentlyBoarded = recentlyBoardedStudents?.has(row.original.id);
      const isPendingBoarding = pendingBoardingStudents?.has(row.original.id);

      // Show "Boarded ✅" if actually boarded OR if pending (visual feedback)
      if (isBoarded || isPendingBoarding) {
        return (
          <div className="w-16 flex justify-center">
            <Badge
              className="bg-green-100 text-green-800 border-green-200 text-xs min-w-[60px] text-center"
              variant="outline"
            >
              Boarded ✅
            </Badge>
          </div>
        );
      } else {
        // Show "Board" button for students not yet boarded and not pending
        return (
          <div className="w-16 flex justify-center">
            <Button
              onClick={() => onStudentBoard?.(row.original.id)}
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 min-w-[60px]"
              disabled={isPendingBoarding} // Disable button when pending to prevent double-clicks
            >
              Board
            </Button>
          </div>
        );
      }
    },
    size: 100,
  },
];

// Keep the original columns export for backward compatibility
export const columns = createColumns();
