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
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore";
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { useCreateVehicle } from "@/app/school_admin/vehicles/services/mutations";

const vehicleSchema = z.object({
  registration_number: z.string().min(1, "Registration number is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

export default function AddVehicleForm() {
  const router = useRouter();
  const selectedSchool = useSelectedSchoolStore((s) => s.selectedSchool);
  const setSelectedSchool = useSelectedSchoolStore((s) => s.setSelectedSchool);
  const schoolId = selectedSchool?.id;

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: "",
      capacity: 1,
    },
  });

  const { mutate: createVehicle, isPending } = useCreateVehicle();

  const { refetch: refetchSchool } = useGetSchool(schoolId, {
    enabled: false, // Manual fetch only
  });

  function onSubmit(values) {
    if (!schoolId) {
      toast.error("No school selected.");
      return;
    }

    const payload = { ...values, school: schoolId };
    setOpenBackdrop(true);

    createVehicle(payload, {
      onSuccess: async () => {
        toast.success("Vehicle added successfully.");
        try {
          const { data } = await refetchSchool();
          if (data) setSelectedSchool(data);
        } catch (err) {
          console.error("Failed to refresh selected school:", err);
        }
        setOpenBackdrop(false);
        router.push("/school_admin/vehicles");
      },
      onError: () => {
        toast.error("Failed to add vehicle.");
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
          name="registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. KBX 907C" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Vehicle"}
        </Button>
      </form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
