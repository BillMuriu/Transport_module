"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useCreateTrip } from "@/app/trip_teacher/trips/_queries/mutation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  trip_type: z.string(),
  vehicle: z.string(),
  driver: z.string(),
  trip_teacher: z.string(),
  route: z.string(),
});

export default function MyForm() {
  const router = useRouter();
  const { school } = useSchoolStore();
  const user = useAuthStore((state) => state.user);
  const tripTeacher = user?.user_type === "TRIP_TEACHER" ? user : null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trip_teacher: tripTeacher?.id || "",
    },
  });

  const vehicles = school?.vehicles || [];
  const drivers = school?.drivers || [];
  const routes = school?.routes || [];

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { mutate: createTrip, isPending } = useCreateTrip();

  function onSubmit(values) {
    try {
      const schoolId = school?.id;
      const now = new Date().toISOString();

      const payload = {
        name: "This is the trips name",
        ...values,
        trip_action:
          values.trip_type === "morning_pickup" ? "pickup" : "dropoff",
        trip_status: "ongoing",
        school: schoolId,
        start_location: "School",
        end_location: "School",
        departure_time: now,
        arrival_time: null,
        trip_teacher: tripTeacher?.id,
      };

      console.log("Payload being sent:", payload);

      setOpenBackdrop(true);

      createTrip(payload, {
        onSuccess: () => {
          toast.success("Trip started successfully!");
          setOpenBackdrop(false);
          // Redirect based on trip type
          if (values.trip_type === "evening_dropoff") {
            router.push("/school_admin/trip-students-boarding");
          } else {
            router.push("/school_admin/trip-students");
          }
        },
        onError: () => {
          toast.error("Failed to submit the form. Please try again.");
          setOpenBackdrop(false);
        },
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
      setOpenBackdrop(false);
    }
  }

  return (
    <Form {...form}>
      <div className="w-full px-4 sm:px-6 md:px-8 py-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="trip_teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Coordinator</FormLabel>
                <Select
                  value={tripTeacher?.id || field.value}
                  disabled
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full" disabled>
                      <SelectValue placeholder="Trip Coordinator" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tripTeacher && (
                      <SelectItem
                        key={tripTeacher.id}
                        value={tripTeacher.id}
                        disabled
                      >
                        {tripTeacher.username}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trip_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a trip type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning_pickup">
                      Morning Pickup
                    </SelectItem>
                    <SelectItem value="evening_dropoff">
                      Evening Dropoff
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose the vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registration_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose the driver" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select the route to follow" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating Trip..." : "Start Trip"}
          </Button>
        </form>
      </div>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
