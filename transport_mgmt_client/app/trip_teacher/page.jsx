"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Users, PlusCircle } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useTrips } from "./trips/_queries/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardStatCard from "../school_admin/_components/dashboard-stats-card";
import { tripsColumns } from "./trips/_components/trip-columns";
import { DashboardTripsDataTable } from "./trips/_components/dashboard-trip-data";

// Dashboard summary fetcher
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
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });

  // Fetch trips from last 7 days
  const {
    data: tripsData,
    isLoading: isTripsLoading,
    error: tripsError,
  } = useTrips({ lastNDays: 7 });

  return (
    <div className="mt-6 px-4 space-y-6 max-w-3xl mx-auto">
      {/* Ongoing Trip */}
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
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="text-sm px-4 py-1.5 rounded-lg border border-muted text-muted-foreground bg-muted/50 shadow"
          >
            No ongoing trip at the moment.
          </Badge>

          <Button asChild className="gap-2">
            <a href="/trip_teacher/trips/create">
              <PlusCircle className="h-4 w-4" />
              Create New Trip
            </a>
          </Button>
        </div>
      )}

      {/* Active Students */}
      {isSummaryLoading ? (
        <p>Loading student data...</p>
      ) : summaryError ? (
        <p className="text-red-500">Failed to load active students</p>
      ) : (
        <DashboardStatCard
          title="Active Students"
          count={summary?.active_students ?? 0}
          description="Enrolled and active"
          icon={<Users />}
        />
      )}

      {/* Recent Trips (7 days) */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold mb-2">Recent Trips</h2>
        {isTripsLoading ? (
          <p>Loading recent trips...</p>
        ) : tripsError ? (
          <p className="text-red-500">Failed to load recent trips</p>
        ) : (
          <div className="w-full">
            <DashboardTripsDataTable
              columns={tripsColumns}
              data={tripsData ?? []}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TripTeacherDashboard;
