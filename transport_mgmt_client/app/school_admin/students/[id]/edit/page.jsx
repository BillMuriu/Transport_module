"use client";

import { useEffect, useState } from "react";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateStudent, useDeleteStudent } from "../../services/mutation";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react"; // Pencil icon

const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  class_name: z.string().min(1),
  parent_name: z.string().min(1),
  parent_phone: z.string().min(10),
  parent_email: z.string().email(),
  fingerprint_id: z.coerce.number().min(1),
  station: z.string().min(1),
});

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.school?.id;

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 Rail guard

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

  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent(id);
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await axios.get(`${API_BASE_URL}/students/${id}/`);
        form.reset(response.data);
      } catch (error) {
        toast.error("Failed to fetch student details.");
      }
    }

    fetchStudent();
  }, [id, form]);

  const onSubmit = (values) => {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values, school: schoolId };
    console.log("Updating student with data:", payload);

    setOpenBackdrop(true);

    updateStudent(payload, {
      onSuccess: () => {
        toast.success("Student updated successfully.");
        setOpenBackdrop(false);
        router.push("/school_admin/students");
      },
      onError: () => {
        toast.error("Failed to update student.");
        setOpenBackdrop(false);
      },
    });
  };

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
    <div className="relative max-w-xl mx-auto px-4 py-10">
      {/* ✏️ Edit toggle icon */}
      <Button
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 transition"
        title={isEditing ? "Lock" : "Edit"}
      >
        <Pencil className="h-5 w-5" />
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="station"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Station</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter station ID"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex gap-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Student"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Student"}
              </Button>
            </div>
          )}
        </form>
      </Form>
      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
