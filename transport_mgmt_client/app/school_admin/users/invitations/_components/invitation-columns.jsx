"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const invitationColumns = [
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
    accessorKey: "user_type",
    header: () => <span>User Type</span>,
    cell: ({ row }) => <span>{row.getValue("user_type")}</span>,
    size: 140,
  },
  {
    accessorKey: "school_name",
    header: () => <span>School Name</span>,
    cell: ({ row }) => {
      const schoolName = row.getValue("school_name");
      return (
        <span className="truncate" title={schoolName}>
          {schoolName}
        </span>
      );
    },
    size: 200,
  },
  {
    accessorKey: "created_at",
    header: () => <span>Created At</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <span>{date.toLocaleDateString()}</span>;
    },
    size: 120,
  },
  {
    accessorKey: "is_used",
    header: () => <span>Used?</span>,
    cell: ({ row }) => {
      const isUsed = row.getValue("is_used");
      return (
        <Badge
          variant={isUsed ? "destructive" : "secondary"}
          className="capitalize"
        >
          {isUsed ? "Used" : "Not Used"}
        </Badge>
      );
    },
    size: 100,
  },
];
