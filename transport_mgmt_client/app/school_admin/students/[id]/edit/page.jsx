"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import * as z from "zod";
import axios from "axios";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateStudent, useDeleteStudent } from "../../services/mutation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useStations } from "@/app/school_admin/stations/services/queries";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";

// Define empty array outside component to maintain stable reference
const EMPTY_ROUTES = [];

// Grades array for the select component
const GRADES = [
  { value: "grade_1", label: "Grade 1" },
  { value: "grade_2", label: "Grade 2" },
  { value: "grade_3", label: "Grade 3" },
  { value: "grade_4", label: "Grade 4" },
  { value: "grade_5", label: "Grade 5" },
  { value: "grade_6", label: "Grade 6" },
  { value: "grade_7", label: "Grade 7" },
  { value: "grade_8", label: "Grade 8" },
  { value: "grade_9", label: "Grade 9" },
];

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

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.school?.id;

  // Fix: Use a stable selector that doesn't create new objects on each render
  const school = useSchoolStore((s) => s.school);
  const routes = useMemo(
    () => school?.routes || EMPTY_ROUTES,
    [school?.routes]
  );

  // Selected route id state (string or null)
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch stations for selected route
  const { data: stationsData = [], isLoading: isStationsLoading } =
    useStations(selectedRouteId);

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

  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent(id);
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await axios.get(`${API_BASE_URL}/students/${id}/`);
        const studentData = response.data;

        // Extract grade from class_name (can be "Grade 4" or "grade_4")
        let grade = "";
        if (studentData.class_name) {
          // Try both formats: "Grade 4" and "grade_4"
          const traditionalMatch = studentData.class_name.match(/Grade (\d+)/i);
          const underscoreMatch = studentData.class_name.match(/grade_(\d+)/i);
          if (traditionalMatch) {
            grade = `grade_${traditionalMatch[1]}`;
          } else if (underscoreMatch) {
            grade = `grade_${underscoreMatch[1]}`;
          }
        }

        // First set the route ID so stations can load
        if (studentData.station?.route?.id) {
          setSelectedRouteId(studentData.station.route.id.toString());
        }

        // Set form values
        form.reset({
          admission_number: studentData.admission_number,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          grade: grade,
          parent_name: studentData.parent_name,
          parent_phone: studentData.parent_phone,
          parent_email: studentData.parent_email || "",
          station: studentData.station?.id?.toString() || "",
        });

        console.log("Loaded student data:", {
          grade,
          routeId: studentData.station?.route?.id,
          stationId: studentData.station?.id,
        });
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Failed to fetch student details.");
      }
    }

    if (id) {
      fetchStudent();
    }
  }, [id, form]);

  function onSubmit(values) {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    // Use the grade_X format directly for class_name
    const { grade, ...otherValues } = values;
    const payload = {
      ...otherValues,
      class_name: grade,  // grade is already in the format grade_X
      school: schoolId,
    };

    // Detailed logging for debugging
    console.log("=== Student Update Debug Info ===");
    console.log("1. Form Values:", values);
    console.log("2. Grade Format:", {
      gradeValue: grade,
      class_name: payload.class_name,
    });
    console.log("3. Final Payload:", {
      ...payload,
      station: {
        value: payload.station,
        type: typeof payload.station
      },
      school: {
        value: payload.school,
        type: typeof payload.school
      }
    });
    console.log("=== End Debug Info ===");

    setOpenBackdrop(true);

    updateStudent(payload, {
      onSuccess: () => {
        toast.success("Student updated successfully.");
        setOpenBackdrop(false);
        router.push("/school_admin/students");
      },
      onError: (error) => {
        console.error("Error updating student:", error);
        toast.error("Failed to update student");
        setOpenBackdrop(false);
      },
    });
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id, {
        onSuccess: () => {
          toast.success("Student deleted.");
          router.push("/school_admin/students");
        },
        onError: () => {
          toast.error("Failed to delete student.");
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="transition"
            title={isEditing ? "Lock" : "Edit"}
          >
            <Pencil className="h-4 w-4 mr-2" />
            {isEditing ? "Lock" : "Edit"}
          </Button>
        </div>

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
                            disabled={!isEditing}
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
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            disabled={!isEditing}
                          />
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
                          <Input
                            placeholder="Enter last name"
                            {...field}
                            disabled={!isEditing}
                          />
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
                          disabled={!isEditing}
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
                          <Input
                            placeholder="Enter parent's name"
                            {...field}
                            disabled={!isEditing}
                          />
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
                          <Input
                            placeholder="+254XXXXXXXXX"
                            {...field}
                            disabled={!isEditing}
                          />
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
                            disabled={!isEditing}
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
                      disabled={!isEditing}
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
                              disabled={!isEditing}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/school_admin/students")}
              >
                Cancel
              </Button>
              {isEditing && (
                <>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-8"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <CircularProgress size={16} className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Update Student"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="w-full sm:w-auto"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Student"}
                  </Button>
                </>
              )}
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
