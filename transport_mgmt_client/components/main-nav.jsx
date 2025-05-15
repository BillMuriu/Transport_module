"use client";
import React from "react";
import { usePathname } from "next/navigation";
import useTotalStudentsForRouteStore from "@/stores/totalStudentsForRouteStore";
import { PanelLeftIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  // Get ongoing trip from the store
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const hasOngoingTrip = !!ongoingTrip; // true if there's an ongoing trip

  return (
    <button
      onClick={toggleSidebar}
      className="relative flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors h-10 w-10"
      aria-label="Toggle Sidebar"
    >
      <PanelLeftIcon className="w-8 h-8 text-muted-foreground" />
      {hasOngoingTrip && (
        <span className="absolute -top-0.5 -right-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
          </span>
        </span>
      )}
    </button>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const studentCount = useTotalStudentsForRouteStore(
    (state) => state.studentCount
  );

  return (
    <nav className="flex items-center w-full space-x-4 lg:space-x-6 border-none">
      <CustomTrigger />
      {pathname.includes("students-byroute") && (
        <div className="ml-32 text-center">{studentCount ?? "—"}</div>
      )}
    </nav>
  );
}
