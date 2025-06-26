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
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isUsed = row.getValue("is_used");
      return (
        <Badge
          className={
            isUsed
              ? "bg-success/20 text-success hover:bg-success/30"
              : "bg-warning/20 text-warning hover:bg-warning/30"
          }
        >
          {isUsed ? "Used" : "Pending"}
        </Badge>
      );
    },
    size: 100,
  },
  {
    accessorKey: "invite_link",
    header: () => <span>Invitation Link</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm truncate max-w-[300px] block">
        {row.getValue("invite_link")}
      </span>
    ),
    size: 300,
  },
];
