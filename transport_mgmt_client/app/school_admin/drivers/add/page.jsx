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
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useGetSchool } from "../../school-info/services/queries";
import { useCreateDriver } from "../services/mutations";

const driverSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^\+254\d{9}$/, "Must be a valid Kenyan phone number"),
});

export default function AddDriverForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const schoolId = user?.school?.id;
  const { setSchool } = useSchoolStore(); // ✅

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const form = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
    },
  });

  const { mutate: createDriver, isPending } = useCreateDriver();

  const { refetch: refetchSchool } = useGetSchool(schoolId, {
    enabled: false,
  }); // ✅

  function onSubmit(values) {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values, school: schoolId };

    setOpenBackdrop(true);

    createDriver(payload, {
      onSuccess: async () => {
        toast.success("Driver added successfully.");
        try {
          const { data } = await refetchSchool(); // ✅
          if (data) setSchool(data); // ✅
        } catch (err) {
          console.error("Failed to refresh school data:", err);
        }
        setOpenBackdrop(false);
        router.push("/school_admin/drivers");
      },
      onError: () => {
        toast.error("Failed to add driver.");
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
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. David Kiprono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +254733445566" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Driver"}
        </Button>
      </form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
