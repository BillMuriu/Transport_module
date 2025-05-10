"use client";
import React from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import useTotalStudentsForRouteStore from "@/stores/totalStudentsForRouteStore";
import { SidebarTrigger } from "./ui/sidebar";

export function MainNav() {
  const pathname = usePathname(); // Get the current pathname
  const studentCount = useTotalStudentsForRouteStore(
    (state) => state.studentCount
  ); // Access student count from the store

  return (
    <nav className="flex items-center w-full space-x-4 lg:space-x-6 border-none">
      <SidebarTrigger />
      {/* Conditionally display total students based on pathname */}
      {pathname.includes("students-byroute") && (
        <div className="ml-32 text-center">{studentCount ?? "—"}</div>
      )}
    </nav>
  );
}
