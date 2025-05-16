"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => {
      const isSent = row.original.sent;
      return (
        <div className="px-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            disabled={isSent}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    id: "name",
    header: () => <div className="px-4">Name</div>,
    cell: ({ row }) => {
      const firstName = row.original.first_name;
      const lastName = row.original.last_name;
      return <div className="px-4">{`${firstName} ${lastName}`}</div>;
    },
    filterFn: (row, _columnId, filterValue) => {
      const fullName =
        `${row.original.first_name} ${row.original.last_name}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
    size: 200,
  },
  {
    accessorKey: "Grade",
    header: () => <div className="px-4">Grade</div>,
    cell: ({ row }) => <div className="px-4">{row.getValue("Grade")}</div>,
    size: 120,
  },
  {
    accessorKey: "sent",
    header: () => <div className="px-4">Sent</div>,
    cell: ({ row }) => {
      const isSent = row.getValue("sent");
      return (
        <div className="px-4">
          <Badge
            className={
              isSent
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-muted text-muted-foreground border-muted"
            }
            variant="outline"
          >
            {isSent ? "✅ Sent" : "Not Sent"}
          </Badge>
        </div>
      );
    },
    size: 140,
  },
];
