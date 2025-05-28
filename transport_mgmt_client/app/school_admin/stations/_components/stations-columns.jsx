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
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => <span className="truncate">{row.getValue("name")}</span>,
    filterFn: (row, _columnId, filterValue) => {
      return row.original.name
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    size: 160,
  },
  {
    id: "route",
    header: () => <span>Route</span>,
    cell: ({ row }) => <span>{row.original.route?.name ?? "-"}</span>,
    size: 140,
  },
  {
    accessorKey: "latitude",
    header: () => <span>Latitude</span>,
    cell: ({ row }) => <span>{row.getValue("latitude")}</span>,
    size: 100,
  },
  {
    accessorKey: "longitude",
    header: () => <span>Longitude</span>,
    cell: ({ row }) => <span>{row.getValue("longitude")}</span>,
    size: 100,
  },
  {
    accessorKey: "order",
    header: () => <span>Order</span>,
    cell: ({ row }) => <span>{row.getValue("order")}</span>,
    size: 60,
  },
];
