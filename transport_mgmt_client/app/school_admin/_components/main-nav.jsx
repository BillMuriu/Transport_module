"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PanelLeftIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useStudentStore } from "@/stores/useStudentStore";
import { useAuthStore } from "@/stores/useAuthStore";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const hasOngoingTrip = !!ongoingTrip;

  return (
    <button
      onClick={toggleSidebar}
      className="relative flex ml-4 items-center justify-center rounded-md p-2 bg-muted hover:bg-muted/50 transition-colors h-10 w-10"
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
  const { students } = useStudentStore();
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const user = useAuthStore((state) => state.user);

  const hasOngoingTrip = !!ongoingTrip;
  const sentCount = students.filter((student) => student.sent).length;
  const totalCount = students.length;

  const isTripStudentsPage = pathname.includes("trip-students");

  // Get user initials
  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0])?.toUpperCase();
  };

  return (
    <nav className="flex items-center justify-between w-full pr-4 space-x-4 lg:space-x-6">
      <div className="flex items-center space-x-4">
        <CustomTrigger />

        {isTripStudentsPage && hasOngoingTrip && (
          <div className="text-sm text-muted-foreground font-medium">
            {sentCount}/{totalCount} sent
          </div>
        )}
      </div>

      {user && (
        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted text-primary font-bold text-sm uppercase">
          {getInitials(user.username)}
        </div>
      )}
    </nav>
  );
}
