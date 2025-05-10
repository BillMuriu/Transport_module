"use client";

import React from "react";
import useTotalStudentsForRouteStore from "@/stores/totalStudentsForRouteStore";

const TestStorePage = () => {
  const studentCount = useTotalStudentsForRouteStore(
    (state) => state.studentCount
  );

  return (
    <div>
      <h1>Student Count</h1>
      <p>
        {studentCount !== null
          ? `Total Students: ${studentCount}`
          : "No data available"}
      </p>
    </div>
  );
};

export default TestStorePage;
