"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import SearchInput from "./search-input";
import { StudentSentStatusTabs } from "./sent-status-filter";
import DataTableActionButtons from "./data-table-action-buttons";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useSendTripMessages } from "../queries/mutations";

export function DataTable({ columns, data, setStudents }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const { mutate: sendMessagesToParents, isPending } = useSendTripMessages();

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const clearSelection = () => setRowSelection({});

  const handleSendMessages = () => {
    if (!ongoingTrip?.id) return;

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedStudents = selectedRows.map((row) => row.original);
    const phoneNumbers = selectedStudents.map((s) => s.parent_phone);

    sendMessagesToParents(
      {
        tripId: ongoingTrip.id,
        phoneNumbers,
      },
      {
        onSuccess: () => {
          const updatedStudents = data.map((student) => {
            const updatedStudent = selectedStudents.find(
              (s) => s.id === student.id
            );
            return updatedStudent ? { ...student, sent: true } : student;
          });

          setStudents(updatedStudents);
        },
        onError: (error) => {
          console.error("Error sending messages:", error);
        },
      }
    );
  };

  const allRows = table.getRowModel().rows;
  const sentRows = allRows.filter((row) => row.original.sent === true);
  const notSentRows = allRows.filter((row) => row.original.sent !== true);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <SearchInput column={table.getColumn("first_name")} />
        <StudentSentStatusTabs table={table} />
      </div>

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

      <DataTableActionButtons
        table={table}
        selectedRowsCount={selectedRowsCount}
        isPending={isPending}
        sendMessagesToParents={handleSendMessages}
        clearSelection={clearSelection}
      />
    </div>
  );
}
