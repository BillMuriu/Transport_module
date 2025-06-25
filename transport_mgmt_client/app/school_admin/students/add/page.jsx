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
  admission_number: z.string().min(1, "Admission number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  grade: z.string().min(1, "Please select a grade"),
  parent_name: z.string().min(1, "Parent name is required"),
  parent_phone: z.string().min(10, "Parent phone is required"),
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
      admission_number: "",
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

    // Transform grade to class_name format and remove grade from values
    const { grade, ...otherValues } = values;
    const payload = {
      ...otherValues,
      class_name: `grade_${grade}`,
      school: schoolId,
    };

    // Log the payload being sent to the backend
    console.log("Student creation payload:", {
      ...payload,
      class_name: payload.class_name,
      station: typeof payload.station,
      school: typeof payload.school,
    });
    console.log("Raw payload:", payload);

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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-foreground mb-4">
                  Student's Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="admission_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Admission Number{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter admission number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Grade <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                          <SelectContent>
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
                </div>
              </div>

              {/* Parent Information Section */}
              <div className="space-y-6 mt-8">
                <h2 className="text-lg font-medium text-foreground mb-4">
                  Parent Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="parent_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Parent Name{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter parent's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Parent Phone{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+254XXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="parent@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Transportation Section */}
              <div className="space-y-6 mt-8">
                <h2 className="text-lg font-medium text-foreground mb-4">
                  Transportation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel>
                      Route <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        setSelectedRouteId(val || null);
                        form.setValue("station", "");
                      }}
                      value={selectedRouteId || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map((route) => (
                          <SelectItem
                            key={route.id}
                            value={route.id.toString()}
                          >
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  {isStationsLoading ? (
                    <div className="flex items-center justify-center h-[40px] text-muted-foreground">
                      <CircularProgress size={20} />{" "}
                      <span className="ml-2">Loading stations...</span>
                    </div>
                  ) : (
                    selectedRouteId &&
                    stationsData?.results?.length > 0 && (
                      <FormField
                        control={form.control}
                        name="station"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Station{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a station" />
                              </SelectTrigger>
                              <SelectContent>
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
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/school_admin/students")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto px-8"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Student"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
