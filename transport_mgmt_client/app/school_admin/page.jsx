"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DashboardStatCard from "./_components/dashboard-stats-card";
import { Users, BusFront, Route, UserCog } from "lucide-react";

const fetchDashboardSummary = async () => {
  const { data } = await axios.get(
    "https://transport-module.onrender.com/school_admin/dashboard-summary/?school_id=9984c0da-82bc-4581-88f1-971e8beefc1a"
  );
  return data;
};

const SchoolAdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load data</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard
            title="Active Students"
            count={data.active_students}
            description="Enrolled and active"
            icon={<Users />}
          />
          <DashboardStatCard
            title="Active Teachers"
            count={data.active_teachers}
            description="Currently teaching"
            icon={<UserCog />}
          />
          <DashboardStatCard
            title="Active Drivers"
            count={data.active_drivers}
            description="Assigned to vehicles"
            icon={<BusFront />}
          />
          <DashboardStatCard
            title="Active Routes"
            count={data.active_routes}
            description="Running today"
            icon={<Route />}
          />
        </div>
      )}
    </div>
  );
};

export default SchoolAdminDashboard;
