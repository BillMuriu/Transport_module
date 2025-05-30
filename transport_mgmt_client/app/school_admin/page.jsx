import React from "react";
import DashboardStatCard from "./_components/dashboard-stats-card";
import { Users, BusFront, Route, UserCog } from "lucide-react";

const SchoolAdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Active Students"
          count={215}
          description="Enrolled and active"
          icon={<Users />}
        />
        <DashboardStatCard
          title="Active Teachers"
          count={42}
          description="Currently teaching"
          icon={<UserCog />}
        />
        <DashboardStatCard
          title="Active Drivers"
          count={12}
          description="Assigned to vehicles"
          icon={<BusFront />}
        />
        <DashboardStatCard
          title="Active Routes"
          count={8}
          description="Running today"
          icon={<Route />}
        />
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
