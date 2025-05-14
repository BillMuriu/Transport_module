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
import DataTableActions from "./data-table-actions";
import DataTableMinimalActions from "./Data-table-minimal";
import DataTableActionBar from "./data-table-action-bar";

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
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-6" />
                    </TableRow>
                  </>
                )}

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

      <DataTableActions
        selectedCount={selectedRowsCount}
        totalCount={totalRowsCount}
        onClearSelection={clearSelection}
        onLogParentPhones={logParentPhones}
        onMarkAsSent={markAsSent}
      />

      <DataTableActionBar table={table}>
        <DataTableMinimalActions
          selectedCount={selectedRowsCount}
          onClearSelection={clearSelection}
        />
      </DataTableActionBar>
    </div>
  );
}
