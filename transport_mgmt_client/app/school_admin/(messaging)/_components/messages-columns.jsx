"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const messageColumns = [
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
    accessorKey: "recipient",
    header: () => <span>Recipient</span>,
    cell: ({ row }) => <span>{row.original.recipient}</span>,
    size: 140,
  },
  {
    accessorKey: "msg_type",
    header: () => <span>Type</span>,
    cell: ({ row }) => <span>{row.original.msg_type}</span>,
    size: 100,
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();

      const badgeClass =
        status === "sent"
          ? "bg-green-500/10 text-green-600 border border-green-500/20"
          : status === "failed"
          ? "bg-red-500/10 text-red-600 border border-red-500/20"
          : "bg-muted text-muted-foreground";

      return (
        <Badge className={`capitalize font-medium ${badgeClass}`}>
          {status}
        </Badge>
      );
    },
    size: 100,
  },
  {
    accessorKey: "description",
    header: () => <span>Description</span>,
    cell: ({ row }) => <span>{row.original.description}</span>,
    size: 240,
  },
  {
    accessorKey: "date",
    header: () => <span>Date</span>,
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return <span>{format(date, "MM/dd/yyyy hh:mm a")}</span>;
    },
    size: 160,
  },
];
