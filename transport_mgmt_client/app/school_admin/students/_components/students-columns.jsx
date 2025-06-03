"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
    id: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const { id, first_name, last_name } = row.original;
      return (
        <Link
          href={`/school_admin/students/${id}/edit`}
          className="truncate text-primary font-medium flex items-center gap-1 hover:underline hover:text-primary/80 transition-colors"
        >
          {`${first_name} ${last_name}`}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
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
    accessorKey: "class_name",
    header: () => <span>Grade</span>,
    cell: ({ row }) => <span>{row.getValue("class_name")}</span>,
    size: 80,
  },
  {
    id: "station",
    header: () => <span>Station</span>,
    cell: ({ row }) => <span>{row.original.station?.name ?? "-"}</span>,
    size: 140,
  },
  {
    id: "route",
    header: () => <span>Route</span>,
    cell: ({ row }) => <span>{row.original.station?.route?.name ?? "-"}</span>,
    size: 140,
  },
  {
    id: "parent",
    header: () => <span>Parent</span>,
    cell: ({ row }) => <span>{row.original.parent_name}</span>,
    size: 160,
  },
];
