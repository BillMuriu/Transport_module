"use client";

import {
  LayoutDashboard,
  Users,
  Bus,
  FileText,
  LogOut,
  School,
  ChevronDown,
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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/school_admin",
    icon: LayoutDashboard,
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
    icon: Users, // You can swap icon if you want a different one for drivers
  },
  {
    title: "Routes",
    url: "/school_admin/routes",
    icon: FileText, // Change icon if you want
  },
  {
    title: "Stations",
    url: "/school_admin/stations",
    icon: FileText, // Change icon if you want
  },
  {
    title: "Trips",
    icon: Bus,
    submenu: [
      {
        title: "View Trips",
        url: "/school_admin/trips",
      },
      {
        title: "Create Trip",
        url: "/school_admin/trips/create",
      },
    ],
  },

  {
    title: "Messages",
    url: "/school_admin/messages",
    icon: FileText,
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
  //   {
  //     title: "Reports",
  //     url: "/school_admin/reports",
  //     icon: FileText,
  //   },
];

export function SchoolAdminSidebar() {
  const [isTripsOpen, setIsTripsOpen] = useState(true);

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
                                <a href={subitem.url}>{subitem.title}</a>
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
          <a href="#" className="flex w-full items-start gap-2">
            <LogOut />
            <span>Logout</span>
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
