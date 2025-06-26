"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchInput from "../../_components/search-filter";

import { motion } from "framer-motion";

export function StudentsDataTable({ columns, data = [] }) {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  const rowAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
          <SearchInput
            column={table.getColumn("name")}
            placeholder="Search students..."
          />
        </div>

        {/* Table Container */}
        <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
          <Table className="bg-card">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-foreground font-semibold py-4 px-6 text-left"
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
              {visibleRows.length > 0 ? (
                visibleRows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowAnimation}
                    className="border-b border-border hover:bg-accent/10 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 px-6 text-card-foreground group-hover:text-foreground transition-colors"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow className="border-b border-border">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground py-8"
                  >
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
