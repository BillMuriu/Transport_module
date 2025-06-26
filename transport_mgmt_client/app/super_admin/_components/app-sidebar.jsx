"use client";

import * as React from "react";
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react";

import { Users, Bus, FileText } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { SchoolSelector } from "./school-selector";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  superAdminNav: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
  ],
  onboardingNav: [
    {
      title: "Students",
      url: "/super_admin/students",
      icon: Users,
    },
    {
      title: "Vehicles",
      url: "/super_admin/vehicles",
      icon: Bus,
    },
    {
      title: "Drivers",
      url: "/super_admin/drivers",
      icon: Users,
    },
    {
      title: "Routes",
      url: "/super_admin/routes",
      icon: FileText,
    },
    {
      title: "Stations",
      url: "/super_admin/stations",
      icon: FileText,
    },
    {
      title: "Users",
      url: "/super_admin/users/invitations",
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
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar(props) {
  const [mode, setMode] = React.useState("super-admin");

  const handleSchoolSelect = (school) => {
    console.log("Selected school:", school);
    // Handle school selection logic here
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Tabs
          defaultValue="super-admin"
          value={mode}
          onValueChange={setMode}
          className="w-full mt-4"
        >
          <TabsList className="w-full justify-around bg-muted border border-border">
            <TabsTrigger
              value="super-admin"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Super Admin
            </TabsTrigger>
            <TabsTrigger
              value="onboarding"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Onboarding
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SidebarHeader>

      <SidebarContent className="">
        {mode === "super-admin" && (
          <>
            <NavMain items={data.superAdminNav} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}

        {mode === "onboarding" && (
          <>
            <SchoolSelector
              isOnboarding={mode === "onboarding"}
              onSchoolSelect={handleSchoolSelect}
            />
            <NavMain items={data.onboardingNav} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
