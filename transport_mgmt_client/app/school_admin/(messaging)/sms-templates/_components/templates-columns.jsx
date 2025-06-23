"use client";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";

export const templateColumns = [
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
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const { id, name } = row.original;
      return (
        <Link
          href={`/school_admin/(messaging)/sms-templates/${id}/edit`}
          className="truncate text-primary font-medium flex items-center gap-1 hover:underline hover:text-primary/80 transition-colors"
        >
          {name}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      );
    },
    size: 160,
  },
  {
    accessorKey: "description",
    header: () => <span>Description</span>,
    cell: ({ row }) => <span>{row.original.description}</span>,
    size: 200,
  },
  {
    accessorKey: "content",
    header: () => <span>Content</span>,
    cell: ({ row }) => <span className="truncate">{row.original.content}</span>,
    size: 300,
  },
];
