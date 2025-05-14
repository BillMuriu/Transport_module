"use client";

import React from "react";

export default function DataTableActions({
  selectedCount,
  totalCount,
  onClearSelection,
  onLogParentPhones,
  onMarkAsSent,
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount} of {totalCount} row(s) selected.
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onClearSelection}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Clear Selection
        </button>
        <button
          onClick={onLogParentPhones}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Log Parent Phones
        </button>
        <button
          onClick={onMarkAsSent}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Mark as Sent
        </button>
      </div>
    </div>
  );
}
