"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BoardingStatusFilter } from "./boarding-status-filter";
import SearchInput from "@/app/school_admin/_components/search-filter";

export function BoardingDataTable({ columns, data }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const allRows = table.getRowModel().rows;
  const boardedRows = allRows.filter((row) => row.original.boarded === true);
  const notBoardedRows = allRows.filter((row) => row.original.boarded !== true);

  const rowAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  };

  if (data.length === 0) {
    return (
      <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded">
        No students assigned to this route.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <SearchInput
          column={table.getColumn("name")}
          placeholder="Search students..."
        />
        <BoardingStatusFilter table={table} />
      </div>
      
      <div className="space-y-8">
        {/* Not Boarded Students Section */}
        {notBoardedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-red-50 text-red-800 py-2 px-4 mb-2 rounded-md">
              Students Yet to Board ({notBoardedRows.length})
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full table-auto text-xs md:text-sm border-separate border-spacing-y-[4px]">
                <TableHeader>
                  <TableRow>
                    {table.getHeaderGroups()[0].headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="py-1 px-2 md:py-2 md:px-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notBoardedRows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : ""}
                      className="hover:bg-muted/50"
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      variants={rowAnimation}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-2 px-2 md:py-4 md:px-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Boarded Students Section */}
        {boardedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-green-50 text-green-800 py-2 px-4 mb-2 rounded-md">
              Boarded Students ({boardedRows.length})
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full table-auto text-xs md:text-sm border-separate border-spacing-y-[4px]">
                <TableHeader>
                  <TableRow>
                    {table.getHeaderGroups()[0].headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="py-1 px-2 md:py-2 md:px-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boardedRows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : ""}
                      className="hover:bg-muted/50"
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      variants={rowAnimation}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-2 px-2 md:py-4 md:px-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {allRows.length === 0 && (
          <div className="overflow-x-auto">
            <Table className="w-full table-auto text-xs md:text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="py-1 px-2 md:py-2 md:px-4"
                      >
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
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center py-4 px-2 md:py-6 md:px-4"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 bg-card rounded-lg border border-border shadow-sm">
          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 disabled:bg-muted disabled:text-muted-foreground"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-primary text-primary-foreground border-border hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden px-4 py-3 space-y-3">
            <div className="text-xs text-muted-foreground text-center">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()} ({table.getFilteredRowModel().rows.length}{" "}
              total)
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 disabled:bg-muted disabled:text-muted-foreground px-3 py-2 text-xs"
              >
                Prev
              </Button>
              <div className="text-xs text-muted-foreground min-w-[60px] text-center">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-primary text-primary-foreground border-border hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground px-3 py-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
