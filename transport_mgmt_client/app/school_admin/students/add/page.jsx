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
import { useCreateStudent } from "../services/mutation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useSchoolStore } from "@/stores/useSchoolStore";
import { useStations } from "../../stations/services/queries";

const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  grade: z.string().min(1, "Please select a grade"),
  parent_name: z.string().min(1),
  parent_phone: z.string().min(10),
  parent_email: z.string().email().optional().or(z.literal("")),
  station: z.string().min(1, "Please select a station"),
});

// Define empty array outside component to maintain stable reference
const EMPTY_ROUTES = [];

// Grades array for the select component
const GRADES = [
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
  { value: "7", label: "Grade 7" },
  { value: "8", label: "Grade 8" },
  { value: "9", label: "Grade 9" },
];

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
      grade: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
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
        router.push("/school_admin/students");
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
        {/* Text input fields */}
        {[
          "first_name",
          "last_name",
          "parent_name",
          "parent_phone",
          "parent_email",
        ].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  {fieldName === "parent_email"
                    ? "Parent Email (Optional)"
                    : field.name.replace("_", " ")}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Grade dropdown */}
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {GRADES.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Route dropdown - filtering only */}
        <FormItem className="w-full">
          <FormLabel>Route (filter stations)</FormLabel>
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
