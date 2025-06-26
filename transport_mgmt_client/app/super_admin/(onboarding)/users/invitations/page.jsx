"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useInvitations } from "./services/queries";
import { invitationColumns } from "./_components/invitation-columns";
import { InvitationLinksTable } from "./_components/invitation-datatable";

const InvitationLinksPage = () => {
  const { data, isLoading, isError } = useInvitations();
  const [columnFilters, setColumnFilters] = useState([]);

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
        {/* Header Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Invitation Links
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and view all invitation links
              </p>
            </div>

            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm w-fit"
            >
              <a
                href="/super_admin/users/invitations/generate"
                className="flex gap-2 items-center px-4 py-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Invitation</span>
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
                Loading invitation links...
              </span>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="text-center">
              <div className="text-destructive text-lg font-medium mb-2">
                Failed to load invitation links
              </div>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <InvitationLinksTable
              columns={invitationColumns}
              data={data?.results || []}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationLinksPage;
