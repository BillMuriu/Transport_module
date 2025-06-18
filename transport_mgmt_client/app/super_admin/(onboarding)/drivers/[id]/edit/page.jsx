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
import {
  useUpdateDriver,
  useDeleteDriver,
} from "@/app/school_admin/drivers/services/mutations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore";
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^\+254\d{9}$/, "Must be a valid Kenyan phone number"),
});

export default function EditDriverPage() {
  const { id } = useParams();
  const router = useRouter();
  const schoolId = useSelectedSchoolStore((state) => state.selectedSchool?.id);

  const { setSchool } = useSchoolStore(); // <-- get setSchool
  const { refetch: refetchSchool } = useGetSchool(schoolId, {
    enabled: false,
  });

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
    },
  });

  const { mutate: updateDriver, isPending: isUpdating } = useUpdateDriver(id);
  const { mutate: deleteDriver, isPending: isDeleting } = useDeleteDriver();

  useEffect(() => {
    async function fetchDriver() {
      try {
        const response = await axios.get(`${API_BASE_URL}/drivers/${id}/`);
        form.reset(response.data);
      } catch (error) {
        toast.error("Failed to fetch driver details.");
      }
    }

    fetchDriver();
  }, [id, form]);

  const onSubmit = async (values) => {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    const payload = { ...values, school: schoolId };

    setOpenBackdrop(true);

    updateDriver(payload, {
      onSuccess: async () => {
        toast.success("Driver updated successfully.");
        try {
          const { data } = await refetchSchool();
          if (data) setSchool(data);
        } catch (err) {
          console.error("Failed to refresh school data:", err);
        }
        setOpenBackdrop(false);
        router.push("/school_admin/drivers");
      },
      onError: () => {
        toast.error("Failed to update driver.");
        setOpenBackdrop(false);
      },
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setOpenBackdrop(true);
      deleteDriver(id, {
        onSuccess: async () => {
          toast.success("Driver deleted.");
          try {
            const { data } = await refetchSchool();
            if (data) setSchool(data);
          } catch (err) {
            console.error("Failed to refresh school data:", err);
          }
          setOpenBackdrop(false);
          router.push("/school_admin/drivers");
        },
        onError: () => {
          toast.error("Failed to delete driver.");
          setOpenBackdrop(false);
        },
      });
    }
  };

  return (
    <div className="relative max-w-xl mx-auto px-4 py-10">
      <Button
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4"
        title={isEditing ? "Lock" : "Edit"}
      >
        <Pencil className="h-5 w-5" />
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex gap-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Driver"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Driver"}
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
