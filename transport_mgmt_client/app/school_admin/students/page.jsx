import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import React from "react";

const Students = () => {
  return (
    <div className="w-full max-w-screen-md mx-auto mt-4 flex flex-col items-center px-4">
      <h1 className="mb-10">Students Page...</h1>
      <Button>
        <a
          href="/school_admin/students/add"
          className="w-full flex gap-2 justify-between"
        >
          <PlusCircle />
          <span>Add New Student</span>
        </a>
      </Button>
      <div className="mt-16 w-full p-6 border-2 border-dashed border-gray-400 rounded-lg text-center text-muted-foreground">
        Students content will appear here
      </div>
    </div>
  );
};

export default Students;
