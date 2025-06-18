"use client";

import * as React from "react";
import { Check, ChevronsUpDown, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchools } from "@/app/school_admin/school-info/services/queries";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore";

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

export function SchoolSelector({ isOnboarding = false, onSchoolSelect }) {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = useSchools();
  const schools = data?.results || [];

  const selectedSchool = useSelectedSchoolStore(
    (state) => state.selectedSchool
  );
  const setSelectedSchool = useSelectedSchoolStore(
    (state) => state.setSelectedSchool
  );

  const handleSchoolSelect = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    const isSame = selectedSchool?.id === school?.id;
    const newValue = isSame ? null : school;

    setSelectedSchool(newValue);
    setOpen(false);

    if (onSchoolSelect) {
      onSchoolSelect(newValue);
    }
  };

  if (!isOnboarding) return null;

  const selectedSchoolName = selectedSchool?.name || "Select School";

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
                    <span className="truncate">{selectedSchoolName}</span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(var(--spacing)*68)] p-0"
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
                      {isLoading ? (
                        <CommandItem disabled>Loading...</CommandItem>
                      ) : (
                        schools.map((school) => (
                          <CommandItem
                            key={school.id}
                            value={school.name}
                            onSelect={() => handleSchoolSelect(school.id)}
                            className="cursor-pointer"
                          >
                            {school.name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedSchool?.id === school.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
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
