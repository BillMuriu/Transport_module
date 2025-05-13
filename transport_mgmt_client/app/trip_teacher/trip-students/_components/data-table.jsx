"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export function DataTable({ columns, data, setStudents }) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRowsCount = table.getFilteredRowModel().rows.length;

  const clearSelection = () => setRowSelection({});

  const logParentPhones = () => {
    const selectedStudents = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    const parentPhones = selectedStudents.map(
      (student) => student.parent_phone
    );
    console.log(parentPhones);
  };

  const markAsSent = () => {
    const selectedStudents = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    const updatedStudents = data.map((student) =>
      selectedStudents.some((s) => s.id === student.id)
        ? { ...student, sent: true }
        : student
    );

    setStudents(updatedStudents);
  };

  // Split rows into sent and not sent
  const allRows = table.getRowModel().rows;
  const sentRows = allRows.filter((row) => row.original.sent === true);
  const notSentRows = allRows.filter((row) => row.original.sent !== true);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full table-auto text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {allRows.length ? (
              <>
                {/* SENT SECTION */}
                {sentRows.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="font-semibold bg-muted py-2"
                      >
                        Sent
                      </TableCell>
                    </TableRow>
                    {sentRows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() ? "selected" : ""}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {/* Add extra margin for spacing */}
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-4" />
                    </TableRow>
                  </>
                )}

                {/* NOT SENT SECTION */}
                {notSentRows.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="font-semibold bg-muted py-2"
                      >
                        Not Sent
                      </TableCell>
                    </TableRow>
                    {notSentRows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() ? "selected" : ""}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {/* Add extra margin for spacing */}
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-4" />
                    </TableRow>
                  </>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRowsCount} of {totalRowsCount} row(s) selected.
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear Selection
          </button>
          <button
            onClick={logParentPhones}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Log Parent Phones
          </button>
          <button
            onClick={markAsSent}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Mark as Sent
          </button>
        </div>
      </div>
    </div>
  );
}
