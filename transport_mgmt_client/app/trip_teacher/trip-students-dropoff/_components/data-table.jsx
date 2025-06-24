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

import { motion } from "framer-motion";

export function DropoffDataTable({ columns, data }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      columnFilters,
    },
  });

  const allRows = table.getRowModel().rows;
  const alightedRows = allRows.filter((row) => row.original.alighted === true);
  const notAlightedRows = allRows.filter(
    (row) => row.original.alighted !== true
  );

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
        No students have boarded the bus yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="space-y-8">
        {notAlightedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-red-50 text-red-800 py-2 px-4 mb-2 rounded-md">
              Students Yet to Alight ({notAlightedRows.length})
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
                  {notAlightedRows.map((row, index) => (
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

        {alightedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-green-50 text-green-800 py-2 px-4 mb-2 rounded-md">
              Alighted Students ({alightedRows.length})
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
                  {alightedRows.map((row, index) => (
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
      </div>
    </div>
  );
}
