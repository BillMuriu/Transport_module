"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useStudents } from "./services/queries";
import { columns } from "./_components/students-columns";
import { StudentsDataTable } from "./_components/students-data-table";
import { useAuthStore } from "@/stores/useAuthStore";

const Students = () => {
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.school?.id;
  const { data, isLoading, isError } = useStudents(schoolId);

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
        {/* Header Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Students
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and view all registered students
              </p>
            </div>

            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm w-fit"
            >
              <a
                href="/school_admin/students/add"
                className="flex gap-2 items-center px-4 py-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Student</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading students...
              </span>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="text-center">
              <div className="text-destructive text-lg font-medium mb-2">
                Failed to load students
              </div>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <StudentsDataTable columns={columns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
