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

import SearchInput from "../../trip-students/_components/search-input";
import { StudentSentStatusTabs } from "../../trip-students/_components/sent-status-filter";
import { motion } from "framer-motion";

export function BoardingDataTable({ columns, data }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
          <SearchInput column={table.getColumn("name")} />
          <StudentSentStatusTabs table={table} />
        </div>
      </div>

      <div className="space-y-8">        {boardedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-green-50 text-green-800 py-2 px-4 mb-2">
              Boarded Students
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
        )}{" "}
        {/* Yet to Board Section */}
        {notBoardedRows.length > 0 && (
          <div>
            <div className="font-semibold bg-yellow-50 text-yellow-800 py-2 px-4 mb-2">
              Yet to Board
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
                </TableHeader>                <TableBody>
                  {notBoardedRows.length ? (
                    notBoardedRows.map((row, index) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No records to display
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {/* Empty state */}
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
