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
import { useCreateStation } from "../services/mutations";
import { LocateIcon } from "lucide-react";
import { useSchoolStore } from "@/stores/useSchoolStore";

const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  route_id: z.string().uuid("Route must be a valid UUID"),
  latitude: z.coerce
    .number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    })
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),
  longitude: z.coerce
    .number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    })
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
});

export default function AddStationForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [coordsEnabled, setCoordsEnabled] = useState(false);
  const school = useSchoolStore((s) => s.school);

  const form = useForm({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      route_id: "",
      latitude: 0,
      longitude: 0,
      order: 1,
    },
  });

  const { mutate: createStation, isPending } = useCreateStation();

  function onSubmit(values) {
    if (!user?.school?.id) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values };

    setOpenBackdrop(true);

    createStation(payload, {
      onSuccess: () => {
        toast.success("Station added successfully.");
        setOpenBackdrop(false);
        router.push("/school_admin/stations");
      },
      onError: () => {
        toast.error("Failed to add station.");
        setOpenBackdrop(false);
      },
    });
  }

  function handleGetCurrentCoordinates() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.message("Getting current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        setCoordsEnabled(true);
        toast.success("Coordinates added.");
      },
      () => {
        toast.error("Failed to get location.");
      }
    );
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
                  disabled={!school?.routes || school.routes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {school?.routes?.map((route) => (
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

        <Button
          type="button"
          variant="secondary"
          className="w-full flex bg-muted items-center justify-center gap-2"
          onClick={handleGetCurrentCoordinates}
        >
          <LocateIcon className="w-4 h-4" />
          Get Current Coordinates
        </Button>

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="34.052235"
                  {...field}
                  disabled={!coordsEnabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="-118.243683"
                  {...field}
                  disabled={!coordsEnabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
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
