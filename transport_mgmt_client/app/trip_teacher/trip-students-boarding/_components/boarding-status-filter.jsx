"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

export function BoardingStatusFilter({ table }) {
  const [activeTab, setActiveTab] = useState("all");

  const handleFilterChange = (value) => {
    setActiveTab(value);

    if (value === "boarded") {
      table.getColumn("status")?.setFilterValue(true);
    } else if (value === "pending") {
      table.getColumn("status")?.setFilterValue(false);
    } else {
      table.getColumn("status")?.setFilterValue(undefined);
    }
  };

  const tabData = [
    { value: "all", label: "All Students" },
    { value: "boarded", label: "Boarded" },
    { value: "pending", label: "Not Boarded" },
  ];

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="all"
        onValueChange={handleFilterChange}
        className="w-full"
      >
        <TabsList className="relative flex h-9 w-full items-center rounded-lg bg-muted p-1">
          {tabData.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <div key={tab.value} className="relative flex-1">
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 h-full w-full rounded-md bg-card shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  />
                )}
                <TabsTrigger
                  value={tab.value}
                  className={clsx(
                    "relative z-10 w-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              </div>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
