"use client";

import { TemplatesDataTable } from "./_components/templates-data-table";
import { templateColumns } from "./_components/templates-columns";
import { useTemplates } from "./_services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SMSTemplates() {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[calc(100vh-200px)] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">SMS Templates</h1>
        <Button
          onClick={() =>
            router.push("/school_admin/(messaging)/sms-templates/add")
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>
      <TemplatesDataTable columns={templateColumns} data={templates || []} />
    </div>
  );
}
