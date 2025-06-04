"use client";

import {
  LayoutDashboard,
  Users,
  Bus,
  FileText,
  LogOut,
  School,
  Command,
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

import { Button } from "@/components/ui/button";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useAuthStore } from "@/stores/useAuthStore";

const items = [
  {
    title: "Dashboard",
    url: "/school_admin",
    icon: LayoutDashboard,
  },
  {
    title: "Trips",
    icon: Bus,
    submenu: [
      {
        title: "View Trips",
        url: "/school_admin/trips",
        ongoing: true,
      },
      {
        title: "Create Trip",
        url: "/school_admin/trips/create",
      },
    ],
  },
  {
    title: "Students",
    url: "/school_admin/students",
    icon: Users,
  },
  {
    title: "Vehicles",
    url: "/school_admin/vehicles",
    icon: Bus,
  },
  {
    title: "Drivers",
    url: "/school_admin/drivers",
    icon: Users,
  },
  {
    title: "Routes",
    url: "/school_admin/routes",
    icon: FileText,
  },
  {
    title: "Stations",
    url: "/school_admin/stations",
    icon: FileText,
  },
  {
    title: "Users",
    url: "/school_admin/users",
    icon: Users,
    submenu: [
      {
        title: "Manage Users",
        url: "/school_admin/users/manage",
      },
      {
        title: "Invitation",
        url: "/school_admin/users/invitations",
      },
    ],
  },
  {
    title: "School Info",
    url: "/school_admin/school-info",
    icon: School,
  },
  {
    title: "Settings",
    url: "/school_admin/settings",
    icon: School,
  },
];

export function SchoolAdminSidebar() {
  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const user = useAuthStore((state) => state.user);

  const isTripTeacher =
    ongoingTrip && user && ongoingTrip.trip_teacher_id === user.id;

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
                  <span className="truncate font-semibold">School Admin</span>
                  <span className="truncate text-xs">Dashboard</span>
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
                              {subitem.ongoing && isTripTeacher && (
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
          <a href="#" className="flex w-full items-start gap-2">
            <LogOut />
            <span>Logout</span>
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
