"use client";

import { ColumnDef } from "@tanstack/react-table";

// Column definition for the student data
export const columns = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "sent",
    header: "Sent",
    cell: ({ row }) => (row.getValue("sent") ? "Sent" : "Not Sent"),
  },
];
