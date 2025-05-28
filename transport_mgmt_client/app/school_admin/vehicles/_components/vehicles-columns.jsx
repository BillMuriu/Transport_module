"use client";
import { Checkbox } from "@/components/ui/checkbox";

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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-auto"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "registration_number",
    header: () => <span>Plate</span>,
    cell: ({ row }) => (
      <span className="truncate">{row.original.registration_number}</span>
    ),
    size: 140,
  },
  {
    accessorKey: "capacity",
    header: () => <span>Capacity</span>,
    cell: ({ row }) => <span>{row.original.capacity}</span>,
    size: 100,
  },
];
