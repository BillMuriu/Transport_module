import { Input } from "@/components/ui/input";

export default function SearchInput({ column, placeholder = "Search..." }) {
  return (
    <Input
      placeholder={placeholder}
      value={column?.getFilterValue() ?? ""}
      onChange={(e) => column?.setFilterValue(e.target.value)}
      className="max-w-sm"
    />
  );
}
