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
import { Pencil } from "lucide-react";
import {
  useUpdateRoute,
  useDeleteRoute,
} from "@/app/school_admin/routes/services/mutations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore"; // ✅
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { API_BASE_URL } from "@/config";

const formSchema = z.object({
  name: z.string().min(1, "Route name is required"),
});

export default function EditRoutePage() {
  const { id } = useParams();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const schoolId = useSelectedSchoolStore((s) => s.selectedSchool?.id);

  const { setSelectedSchool } = useSelectedSchoolStore(); // ✅
  const { refetch: refetchSchool } = useGetSchool(schoolId, { enabled: false });

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: updateRoute, isPending: isUpdating } = useUpdateRoute(id);
  const { mutate: deleteRoute, isPending: isDeleting } = useDeleteRoute();

  useEffect(() => {
    async function fetchRoute() {
      try {
        const response = await axios.get(`${API_BASE_URL}/routes/${id}/`);
        form.reset(response.data);
      } catch {
        toast.error("Failed to fetch route details.");
      }
    }

    fetchRoute();
  }, [id, form]);

  const refreshSchoolAndRedirect = async () => {
    try {
      const { data } = await refetchSchool();
      if (data) setSelectedSchool(data); // ✅
    } catch (err) {
      console.error("Failed to refresh school data:", err);
    } finally {
      setOpenBackdrop(false);
      router.push("/super_admin/routes");
    }
  };

  const onSubmit = (values) => {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    setOpenBackdrop(true);

    const payload = { ...values, school: schoolId };

    updateRoute(payload, {
      onSuccess: () => {
        toast.success("Route updated successfully.");
        refreshSchoolAndRedirect();
      },
      onError: () => {
        toast.error("Failed to update route.");
        setOpenBackdrop(false);
      },
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this route?")) {
      deleteRoute(id, {
        onSuccess: () => {
          toast.success("Route deleted.");
          refreshSchoolAndRedirect();
        },
        onError: () => {
          toast.error("Failed to delete route.");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Name</FormLabel>
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
                {isUpdating ? "Updating..." : "Update Route"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Route"}
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
