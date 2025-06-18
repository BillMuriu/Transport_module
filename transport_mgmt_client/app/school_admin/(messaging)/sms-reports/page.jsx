"use client";

import { Loader2 } from "lucide-react";
import { useMessages } from "../_services/queries";
import { messageColumns } from "../_components/messages-columns";
import { MessagesDataTable } from "../_components/messages-data-table";

const Messages = () => {
  const { data, isLoading, isError } = useMessages();

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-6xl mx-auto mt-4 flex flex-col px-4">
        {/* Header Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Messages
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                View all SMS messages sent to parents
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading messages...
              </span>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12">
            <div className="text-center">
              <div className="text-destructive text-lg font-medium mb-2">
                Failed to load messages
              </div>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <MessagesDataTable columns={messageColumns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
