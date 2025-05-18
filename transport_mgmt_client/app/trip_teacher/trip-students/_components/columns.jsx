"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => {
      const isSent = row.original.sent;
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isSent}
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
      return <span className="truncate">{`${firstName} ${lastName}`}</span>;
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
    accessorKey: "sent",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const isSent = row.getValue("sent");
      return (
        <Badge
          className={
            isSent
              ? "bg-green-100 text-green-800 border-green-200 text-xs"
              : "bg-muted text-muted-foreground border-muted text-xs"
          }
          variant="outline"
        >
          {isSent ? "✅ Sent" : "Not Sent"}
        </Badge>
      );
    },
    size: 100,
  },
];
