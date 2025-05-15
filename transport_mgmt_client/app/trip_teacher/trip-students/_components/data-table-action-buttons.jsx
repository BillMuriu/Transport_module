import React from "react";
import { Button } from "@/components/ui/button";
import DataTableMinimalActions from "./Data-table-minimal";
import DataTableActionBar from "./data-table-action-bar";
import { Send } from "lucide-react";

const DataTableActionButtons = ({
  table,
  selectedRowsCount,
  isPending,
  sendMessagesToParents,
  clearSelection,
}) => {
  return (
    <DataTableActionBar
      table={table}
      className="flex flex-row justify-between items-center gap-4 px-4 py-2"
    >
      <DataTableMinimalActions
        selectedCount={selectedRowsCount}
        onClearSelection={clearSelection}
      />
      <Button
        onClick={sendMessagesToParents}
        disabled={isPending || selectedRowsCount === 0}
        className="w-auto flex items-center gap-2 border-2 border-transparent hover:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isPending && <Send className="size-4" />} {/* Send icon */}
        {isPending ? "Sending..." : "Send"}
      </Button>
    </DataTableActionBar>
  );
};

export default DataTableActionButtons;
