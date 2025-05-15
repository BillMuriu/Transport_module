"use client";

import {
  Bus,
  ChevronDown,
  Command,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "../button";
import { useState } from "react";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";

const items = [
  {
    title: "Dashboard",
    url: "/trip_teacher",
    icon: LayoutDashboard,
  },
  {
    title: "Trips",
    icon: Bus,
    submenu: [
      {
        title: "All Trips",
        url: "/trip_teacher/trips",
      },
      {
        title: "Ongoing Trip",
        url: "/trip_teacher/trips/ongoing",
        ongoing: true,
      },
    ],
  },
  {
    title: "Trips Messages",
    url: "/trip_teacher/trip-messages",
    icon: MessageCircle,
  },
  {
    title: "Students",
    url: "/trip_teacher/students",
    icon: Users,
  },
];

export function TripTeacherSidebar() {
  const [isTripsOpen, setIsTripsOpen] = useState(true);
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);

  return (
    <Sidebar variant="floating" collapsible="icon" className="w-52">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Company Name</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.submenu ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen
                    onOpenChange={setIsTripsOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span className="flex-1">{item.title}</span>
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              isTripsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subitem) => (
                            <SidebarMenuSubItem key={subitem.title}>
                              <SidebarMenuSubButton asChild>
                                <a
                                  href={subitem.url}
                                  className="flex items-center gap-2"
                                >
                                  <span>{subitem.title}</span>
                                  {subitem.ongoing && ongoingTrip?.id && (
                                    <span className="ml-auto relative flex h-2 w-2 rounded-full bg-green-500 animate-ping">
                                      <span className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-700" />
                                    </span>
                                  )}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="outline" className="flex">
          <a href="" className="flex w-full items-start gap-2">
            <LogOut />
            <span>Logout</span>
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
