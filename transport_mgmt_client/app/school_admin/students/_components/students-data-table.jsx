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

import { motion } from "framer-motion";

export function StudentsDataTable({ columns, data }) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-4">
      {/* Table View - Visible from sm and up */}
      <div className="overflow-x-auto hidden sm:block">
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
            {visibleRows.length > 0 ? (
              visibleRows.map((row, index) => (
                <motion.tr
                  key={row.id}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center py-4 px-2 md:py-6 md:px-4"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View - Visible on small screens only */}
      <div className="flex flex-col gap-4 sm:hidden">
        {visibleRows.length > 0 ? (
          visibleRows.map((row, index) => (
            <motion.div
              key={row.id}
              initial="hidden"
              animate="visible"
              custom={index}
              variants={rowAnimation}
              className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="text-sm">
                  <span className="font-semibold">
                    {flexRender(
                      cell.column.columnDef.header,
                      cell.getContext()
                    )}
                    :{" "}
                  </span>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-sm py-8">No results.</div>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
