"use client";

import {
  Bus,
  LayoutDashboard,
  LogOut,
  Users,
  Command,
  FileText,
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

import { Button } from "../button";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useSchoolStore } from "@/stores/useSchoolStore";

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
        url: "/trip_teacher/trip-students",
        ongoing: true,
      },
    ],
  },
  {
    title: "Students",
    url: "/trip_teacher/students",
    icon: Users,
  },
  {
    title: "Stations",
    url: "/trip_teacher/stations",
    icon: FileText,
  },
];

export function TripTeacherSidebar() {
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const school = useSchoolStore((s) => s.school);

  return (
    <Sidebar variant="floating" collapsible="icon" className="w-52">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-sm font-bold text-center">
                    {school?.name ? school.name.charAt(0).toUpperCase() : "S"}
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span
                    className="truncate font-semibold"
                    title={school?.name || "School Name"}
                  >
                    {school?.name || "School Name"}
                  </span>
                  <span className="truncate text-xs">Institution</span>
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
                  <SidebarMenuItem
                    key={item.title}
                    className="flex flex-col gap-1"
                  >
                    <SidebarMenuButton>
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                    </SidebarMenuButton>
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
                  </SidebarMenuItem>
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
