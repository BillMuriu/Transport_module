"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

export function StudentSentStatusTabs({ table }) {
  const [activeTab, setActiveTab] = useState("all");

  const handleFilterChange = (value) => {
    setActiveTab(value);

    if (value === "sent") {
      table.getColumn("sent")?.setFilterValue(true);
    } else if (value === "not_sent") {
      table.getColumn("sent")?.setFilterValue(false);
    } else {
      table.getColumn("sent")?.setFilterValue(undefined);
    }
  };

  const tabValues = ["all", "sent", "not_sent"];

  return (
    <Tabs
      defaultValue="all"
      onValueChange={handleFilterChange}
      className="w-full"
    >
      <TabsList className="relative flex bg-muted rounded-md p-1">
        {tabValues.map((value) => {
          const isActive = activeTab === value;

          return (
            <div key={value} className="relative">
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 h-full w-full rounded-md bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <TabsTrigger
                value={value}
                className={clsx(
                  "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {value.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
              </TabsTrigger>
            </div>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
