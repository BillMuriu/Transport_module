"use client";

import { useState, useMemo } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCreateStudent } from "@/app/school_admin/students/services/mutation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useSchoolStore } from "@/stores/useSchoolStore";
import { useStations } from "@/app/school_admin/stations/services/queries";

const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  class_name: z.string().min(1),
  parent_name: z.string().min(1),
  parent_phone: z.string().min(10),
  parent_email: z.string().email(),
  fingerprint_id: z.coerce.number().min(1),
  station: z.string().min(1, "Please select a station"),
});

// Define empty array outside component to maintain stable reference
const EMPTY_ROUTES = [];

export default function AddStudentForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const schoolId = user?.school?.id;

  // Fix: Use a stable selector that doesn't create new objects on each render
  const school = useSchoolStore((s) => s.school);
  const routes = useMemo(
    () => school?.routes || EMPTY_ROUTES,
    [school?.routes]
  );

  // Selected route id state (string or null)
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // Fetch stations for selected route
  const { data: stationsData = [], isLoading: isStationsLoading } =
    useStations(selectedRouteId);

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      class_name: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      fingerprint_id: 0,
      station: "",
    },
  });

  const { mutate: createStudent, isPending } = useCreateStudent();

  function onSubmit(values) {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values, school: schoolId };

    setOpenBackdrop(true);

    createStudent(payload, {
      onSuccess: () => {
        toast.success("Student added successfully.");
        setOpenBackdrop(false);
        router.push("/trip_teacher/students");
      },
      onError: () => {
        toast.error("Failed to add student.");
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
        {/* Existing text inputs */}
        {[
          "first_name",
          "last_name",
          "class_name",
          "parent_name",
          "parent_phone",
          "parent_email",
          "fingerprint_id",
        ].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  {field.name.replace("_", " ")}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Route dropdown - filtering only */}
        <FormItem className="w-full">
          <FormLabel>Route</FormLabel>
          <Select
            onValueChange={(val) => {
              setSelectedRouteId(val || null);
              form.setValue("station", ""); // Reset station selection when route changes
            }}
            value={selectedRouteId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a route" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id.toString()}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        {/* Loading indicator while fetching stations */}
        {isStationsLoading && (
          <div className="py-2 text-center text-sm text-gray-500">
            Loading stations...
          </div>
        )}

        {/* Station dropdown - shown only when a route is selected */}
        {selectedRouteId &&
          !isStationsLoading &&
          stationsData?.results?.length > 0 && (
            <FormField
              control={form.control}
              name="station"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Station</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a station" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {stationsData.results.map((station) => (
                        <SelectItem
                          key={station.id}
                          value={station.id.toString()}
                        >
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Student"}
        </Button>
      </form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
