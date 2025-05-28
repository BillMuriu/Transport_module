"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useStudents } from "./services/queries";
import { columns } from "./_components/students-columns";
import { StudentsDataTable } from "./_components/students-data-table";
import { Loader2 } from "lucide-react";

const Students = () => {
  const { data, isLoading, isError } = useStudents();

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold">Students</h1>
        <Button asChild>
          <a
            href="/school_admin/students/add"
            className="flex gap-2 items-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Student</span>
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading students...
          </span>
        </div>
      ) : isError ? (
        <div className="mt-16 text-center text-red-500">
          Failed to load students.
        </div>
      ) : (
        <div className="mt-6">
          <StudentsDataTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};

export default Students;
