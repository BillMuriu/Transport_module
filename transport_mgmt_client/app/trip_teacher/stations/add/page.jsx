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
// import { LocateIcon } from "lucide-react"; // Location icon not needed anymore
import { useSchoolStore } from "@/stores/useSchoolStore";

const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  route_id: z.string().uuid("Route must be a valid UUID"),
  // latitude: z.coerce
  //   .number({ required_error: "Latitude is required", invalid_type_error: "Latitude must be a number" })
  //   .min(-90, "Latitude must be >= -90")
  //   .max(90, "Latitude must be <= 90"),
  // longitude: z.coerce
  //   .number({ required_error: "Longitude is required", invalid_type_error: "Longitude must be a number" })
  //   .min(-180, "Longitude must be >= -180")
  //   .max(180, "Longitude must be <= 180"),
  // order: z.coerce.number().int().min(1, "Order must be at least 1"),
});

export default function AddStationForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // const [coordsEnabled, setCoordsEnabled] = useState(false);
  // const [isLocating, setIsLocating] = useState(false);
  // const [locationSuccess, setLocationSuccess] = useState(null);
  const school = useSchoolStore((s) => s.school);

  const form = useForm({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      route_id: "",
      // latitude: 0,
      // longitude: 0,
      // order: 1,
    },
  });

  const { mutate: createStation, isPending } = useCreateStation();

  function onSubmit(values) {
    if (!user?.school?.id) {
      toast.error("No school assigned to this user.");
      return;
    }

    // const payload = { ...values };
    const payload = {
      name: values.name,
      route_id: values.route_id,
      // latitude: values.latitude,
      // longitude: values.longitude,
      // order: values.order,
    };

    setOpenBackdrop(true);

    createStation(payload, {
      onSuccess: () => {
        toast.success("Station added successfully.");
        setOpenBackdrop(false);
        router.push("/trip_teacher/stations");
      },
      onError: () => {
        toast.error("Failed to add station.");
        setOpenBackdrop(false);
      },
    });
  }

  // function handleGetCurrentCoordinates() {
  //   if (!navigator.geolocation) {
  //     setLocationSuccess(false);
  //     return;
  //   }

  //   setIsLocating(true);
  //   setLocationSuccess(null);

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       form.setValue("latitude", latitude);
  //       form.setValue("longitude", longitude);
  //       setCoordsEnabled(true);
  //       setLocationSuccess(true);
  //       setIsLocating(false);
  //     },
  //     () => {
  //       setLocationSuccess(false);
  //       setIsLocating(false);
  //     }
  //   );
  // }

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
                  <SelectTrigger className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring">
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

        {/** Location button and status removed */}
        {/* 
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-between gap-2 bg-muted"
          onClick={handleGetCurrentCoordinates}
        >
          <div className="flex items-center gap-2">
            <LocateIcon className="w-4 h-4" />
            Get Current Coordinates
          </div>

          {isLocating ? (
            <svg
              className="w-4 h-4 animate-spin text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          ) : locationSuccess === true ? (
            <span className="text-green-600 text-lg">✅</span>
          ) : locationSuccess === false ? (
            <span className="text-red-600 text-lg">❌</span>
          ) : null}
        </Button>

        {locationSuccess === false && (
          <p className="text-sm text-destructive mt-1">
            Unable to fetch location. Please allow location access in your
            browser settings.
          </p>
        )} 
        */}

        {/** Latitude field removed */}
        {/* <FormField
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
        /> */}

        {/** Longitude field removed */}
        {/* <FormField
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
        /> */}

        {/** Order field removed */}
        {/* <FormField
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
        /> */}

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
