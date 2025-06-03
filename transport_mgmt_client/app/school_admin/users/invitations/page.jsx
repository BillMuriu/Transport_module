"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const Invitations = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
      <div className="flex justify-center items-center mb-4">
        <Button asChild>
          <Link
            href="/school_admin/users/invitations/generate
          "
            className="flex gap-2 items-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invitation Link</span>
          </Link>
        </Button>
      </div>

      {/* Additional UI content can go here */}
    </div>
  );
};

export default Invitations;
