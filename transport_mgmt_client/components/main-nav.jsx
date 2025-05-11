"use client";
import React from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import useTotalStudentsForRouteStore from "@/stores/totalStudentsForRouteStore";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors h-40"
      aria-label="Toggle Sidebar"
    >
      <PanelLeftIcon className="w-5 h-20 text-muted-foreground" />
    </button>
  );
}

export function MainNav() {
  const pathname = usePathname(); // Get the current pathname
  const studentCount = useTotalStudentsForRouteStore(
    (state) => state.studentCount
  ); // Access student count from the store

  return (
    <nav className="flex items-center w-full space-x-4 lg:space-x-6 border-none">
      <CustomTrigger />
      {pathname.includes("students-byroute") && (
        <div className="ml-32 text-center">{studentCount ?? "—"}</div>
      )}
    </nav>
  );
}
