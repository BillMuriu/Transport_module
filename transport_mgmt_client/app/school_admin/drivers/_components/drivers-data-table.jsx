"use client";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";

export const driverColumns = [
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
    accessorKey: "full_name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const { id, full_name } = row.original;
      return (
        <Link
          href={`/school_admin/drivers/${id}/edit`}
          className="truncate text-primary font-medium flex items-center gap-1 hover:underline hover:text-primary/80 transition-colors"
        >
          {full_name}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      );
    },
    size: 160,
  },
  {
    accessorKey: "phone_number",
    header: () => <span>Phone Number</span>,
    cell: ({ row }) => <span>{row.original.phone_number}</span>,
    size: 140,
  },
];
