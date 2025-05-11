"use client";

import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const TripTeacherDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const school = user?.school || {};
  const { name: schoolName, phone_number: schoolPhone } = school;
  const username = user?.username;
  const email = user?.email;
  const userPhone = user?.phone_number;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Trip Coordinator Dashboard</h1>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md overflow-x-auto max-w-full">
        <div className="space-y-4">
          <p>
            <strong>School Name:</strong> {schoolName || "N/A"}
          </p>
          <p>
            <strong>Username:</strong> {username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {email || "N/A"}
          </p>
          <p>
            <strong>User Phone:</strong> {userPhone || "N/A"}
          </p>
          <p>
            <strong>School Phone:</strong> {schoolPhone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripTeacherDashboard;
