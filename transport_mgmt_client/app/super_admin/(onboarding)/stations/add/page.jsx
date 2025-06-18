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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCreateStation } from "@/app/school_admin/stations/services/mutations";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore";

// --- UPDATED SCHEMA (latitude, longitude, order removed) ---
const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  route_id: z.string().uuid("Route must be a valid UUID"),
});

export default function AddStationForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const selectedSchool = useSelectedSchoolStore((s) => s.selectedSchool);
  const routes = selectedSchool?.routes || [];

  const form = useForm({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      route_id: "",
    },
  });

  const { mutate: createStation, isPending } = useCreateStation();

  function onSubmit(values) {
    if (!selectedSchool?.id) {
      toast.error("No school selected.");
      return;
    }

    const payload = { ...values };

    setOpenBackdrop(true);

    createStation(payload, {
      onSuccess: () => {
        toast.success("Station added successfully.");
        setOpenBackdrop(false);
        router.push("/super_admin/stations");
      },
      onError: () => {
        toast.error("Failed to add station.");
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Sunset Boulevard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="route_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Route</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={routes.length === 0}
                >
                  <SelectTrigger className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring">
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Add Station"}
        </Button>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </form>
    </Form>
  );
}
