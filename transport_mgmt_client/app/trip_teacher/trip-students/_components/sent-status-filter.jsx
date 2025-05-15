"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StudentSentStatusTabs({ table }) {
  const handleFilterChange = (value) => {
    if (value === "sent") {
      table.getColumn("sent")?.setFilterValue(true);
    } else if (value === "not_sent") {
      table.getColumn("sent")?.setFilterValue(false);
    } else {
      table.getColumn("sent")?.setFilterValue(undefined);
    }
  };

  return (
    <Tabs
      defaultValue="all"
      className="w-full"
      onValueChange={handleFilterChange}
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="not_sent">Not Sent</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
