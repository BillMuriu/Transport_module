"use client";

import React from "react";
import { useAuthStore } from "@/stores/useAuthStore"; // make sure path is correct

const TripTeacherDashboard = () => {
  const user = useAuthStore((state) => state.user); // ✅ access 'user' not 'access'

  return (
    <div>
      <h1>TripTeacherDashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default TripTeacherDashboard;
