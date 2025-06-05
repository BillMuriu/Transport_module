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

import { motion } from "framer-motion";

export function DashboardTripsDataTable({ columns, data }) {
  const [showAll, setShowAll] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const visibleRows = showAll ? rows : rows.slice(0, 4);

  const rowAnimation = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.025 },
    }),
  };

  return (
    <div className="w-full max-w-full relative">
      <div className="rounded-lg overflow-hidden relative">
        <Table className="bg-transparent">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-xs font-semibold text-muted-foreground"
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
            {visibleRows.length ? (
              visibleRows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowAnimation}
                  className="rounded-md bg-card hover:bg-muted/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2 text-sm">
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
                  className="text-center text-muted-foreground py-8"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Smoky fade effect at the bottom, only when not showing all */}
        {!showAll && rows.length > 6 && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent" />
        )}
      </div>

      {/* View More / View Less button */}
      {rows.length > 6 && (
        <div className="flex justify-center mt-2">
          <button
            // onClick={() => setShowAll(!showAll)}
            onClick={() => {}}
            className="px-4 py-1 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            {showAll ? "View Less" : `View More (${rows.length - 6})`}
          </button>
        </div>
      )}
    </div>
  );
}
