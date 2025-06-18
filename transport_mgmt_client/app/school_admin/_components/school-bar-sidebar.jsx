"use client";

import {
  LayoutDashboard,
  Users,
  Bus,
  FileText,
  LogOut,
  School,
  Command,
  Send,
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
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useAuthStore } from "@/stores/useAuthStore";

const messagingNavItems = [
  {
    href: "/school_admin/send-message",
    icon: Send,
    label: "Send SMS",
  },
  {
    href: "/school_admin/sms-reports",
    icon: FileText,
    label: "SMS Reports",
  },
  {
    href: "/school_admin/sms-templates",
    icon: FileText,
    label: "SMS Templates",
  },
];

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
  const school = useSchoolStore((s) => s.school);

  const isTripTeacher =
    ongoingTrip && user && ongoingTrip.trip_teacher_id === user.id;

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
        <SidebarGroup>
          <SidebarGroupLabel>Messaging</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {messagingNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
