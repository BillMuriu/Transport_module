"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore"; // ✅
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { useCreateRoute } from "@/app/school_admin/routes/services/mutations";

const routeSchema = z.object({
  name: z.string().min(1, "Route name is required"),
});

export default function AddRouteForm() {
  const router = useRouter();
  const schoolId = useSelectedSchoolStore((s) => s.selectedSchool?.id);

  const { setSelectedSchool } = useSelectedSchoolStore(); // ✅

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const form = useForm({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createRoute, isPending } = useCreateRoute();
  const { refetch: refetchSchool } = useGetSchool(schoolId, { enabled: false });

  async function onSubmit(values) {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values, school: schoolId };
    setOpenBackdrop(true);

    createRoute(payload, {
      onSuccess: async () => {
        toast.success("Route added successfully.");
        try {
          const { data } = await refetchSchool(); // ✅
          if (data) setSelectedSchool(data); // ✅
        } catch (err) {
          console.error("Failed to refresh school data:", err);
        }
        setOpenBackdrop(false);
        router.push("/super_admin/routes");
      },
      onError: () => {
        toast.error("Failed to add route.");
        setOpenBackdrop(false);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto space-y-6 py-10 px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Route 1 - through CBD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Route"}
        </Button>
      </form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
