import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const tripsColumns = [
  {
    accessorKey: "trip_type",
    header: "Trip Type",
    cell: (info) => (
      <Badge variant="secondary">{info.getValue().replace(/_/g, " ")}</Badge>
    ),
  },
  {
    accessorKey: "trip_status",
    header: "Status",
    cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
  },
  {
    accessorKey: "departure_time",
    header: "Trip Date",
    cell: (info) =>
      info.getValue() ? format(new Date(info.getValue()), "MMMM do") : "N/A",
  },
  {
    accessorKey: "expected_students",
    header: "Expected",
    cell: (info) => {
      const students = info.getValue() || [];
      return students.length;
    },
  },
  {
    accessorKey: "boarded_students",
    header: "Boarded",
    cell: (info) => {
      const students = info.getValue() || [];
      return students.length;
    },
  },
];
