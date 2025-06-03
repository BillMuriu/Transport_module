"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users } from "lucide-react";
import DashboardStatCard from "../school_admin/_components/dashboard-stats-card";
import { API_BASE_URL } from "@/config";

const fetchDashboardSummary = async () => {
  const { data } = await axios.get(
    `${API_BASE_URL}/school_admin/dashboard-summary/?school_id=9984c0da-82bc-4581-88f1-971e8beefc1a`
  );
  return data;
};
const TripTeacherDashboard = () => {
  const { ongoingTrip } = useOngoingTripStore();

  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });

  return (
    <div className="mt-6 px-4 space-y-6 max-w-md mx-auto">
      {ongoingTrip ? (
        <div className="p-4 border rounded-xl shadow-sm bg-white space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="capitalize text-xs px-3 py-1 rounded-md border-2 border-blue-500 text-blue-600 bg-blue-100 shadow-sm"
            >
              {ongoingTrip.trip_type.replace("_", " ")}
            </Badge>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">Departure:</span>{" "}
              {format(new Date(ongoingTrip.departure_time), "PPPpp")}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Link href="/trip_teacher/trip-students">
              <Button size="sm" variant="outline">
                Manage Trip
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 flex justify-center">
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 rounded-md border-2 border-gray-400 text-gray-600 bg-gray-100 shadow-sm"
          >
            No ongoing trip at the moment.
          </Badge>
        </div>
      )}

      {/* Student Card - Always shown */}
      {isLoading ? (
        <p>Loading student data...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load active students</p>
      ) : (
        <DashboardStatCard
          title="Active Students"
          count={summary?.active_students ?? 0}
          description="Enrolled and active"
          icon={<Users />}
        />
      )}
    </div>
  );
};

export default TripTeacherDashboard;
