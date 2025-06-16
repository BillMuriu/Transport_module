"use client";

import * as React from "react";
import { Check, ChevronsUpDown, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sample schools data - replace with your actual data
const schools = [
  {
    value: "harvard-university",
    label: "Harvard University",
  },
  {
    value: "stanford-university",
    label: "Stanford University",
  },
  {
    value: "mit",
    label: "Massachusetts Institute of Technology",
  },
  {
    value: "yale-university",
    label: "Yale University",
  },
  {
    value: "princeton-university",
    label: "Princeton University",
  },
  {
    value: "columbia-university",
    label: "Columbia University",
  },
  {
    value: "university-of-chicago",
    label: "University of Chicago",
  },
  {
    value: "caltech",
    label: "California Institute of Technology",
  },
];

export function SchoolSelector({ isOnboarding = false, onSchoolSelect }) {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState("");

  const handleSchoolSelect = (currentValue) => {
    const newValue = currentValue === selectedSchool ? "" : currentValue;
    setSelectedSchool(newValue);
    setOpen(false);

    // Call the callback function if provided
    if (onSchoolSelect) {
      const school = schools.find((s) => s.value === newValue);
      onSchoolSelect(school);
    }
  };

  // Don't render if not in onboarding mode
  if (!isOnboarding) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  tooltip="Select your school"
                  className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground active:bg-sidebar-accent/90 active:text-sidebar-accent-foreground min-w-8 duration-200 ease-linear w-full justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <School className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {selectedSchool
                        ? schools.find(
                            (school) => school.value === selectedSchool
                          )?.label
                        : "Select School"}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(var(--spacing)*72)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search schools..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No school found.</CommandEmpty>
                    <CommandGroup>
                      {schools.map((school) => (
                        <CommandItem
                          key={school.value}
                          value={school.value}
                          onSelect={handleSchoolSelect}
                          className="cursor-pointer"
                        >
                          {school.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedSchool === school.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Usage example:
// <SchoolSelector
//   isOnboarding={true}
//   onSchoolSelect={(school) => console.log('Selected school:', school)}
// />
