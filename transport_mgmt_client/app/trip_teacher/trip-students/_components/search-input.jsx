// components/search-input.js
import { Input } from "@/components/ui/input";

export default function SearchInput({ column }) {
  return (
    <Input
      placeholder="Search by name..."
      value={column?.getFilterValue() ?? ""}
      onChange={(e) => column?.setFilterValue(e.target.value)}
      className="max-w-sm"
    />
  );
}
