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
  useUpdateVehicle,
  useDeleteVehicle,
} from "@/app/school_admin/vehicles/services/mutations";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore";
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  registration_number: z.string().min(1),
  capacity: z.coerce.number().min(1),
});

export default function EditVehiclePage() {
  const { id } = useParams();
  const router = useRouter();

  const selectedSchool = useSelectedSchoolStore((s) => s.selectedSchool);
  const setSelectedSchool = useSelectedSchoolStore((s) => s.setSelectedSchool);
  const schoolId = selectedSchool?.id;

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration_number: "",
      capacity: 0,
    },
  });

  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle(id);
  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();

  const { refetch: refetchSchool } = useGetSchool(schoolId, { enabled: false });

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicles/${id}/`);
        form.reset(response.data);
      } catch (error) {
        toast.error("Failed to fetch vehicle details.");
      }
    }

    fetchVehicle();
  }, [id, form]);

  const onSubmit = (values) => {
    if (!schoolId) {
      toast.error("No school selected.");
      return;
    }

    const payload = { ...values, school: schoolId };
    setOpenBackdrop(true);

    updateVehicle(payload, {
      onSuccess: async () => {
        toast.success("Vehicle updated successfully.");
        try {
          const { data } = await refetchSchool();
          if (data) setSelectedSchool(data);
        } catch (err) {
          console.error("Failed to refresh selected school:", err);
        }
        setOpenBackdrop(false);
        router.push("/super_admin/vehicles");
      },
      onError: () => {
        toast.error("Failed to update vehicle.");
        setOpenBackdrop(false);
      },
    });
  };

  const handleDelete = () => {
    if (!schoolId) {
      toast.error("No school selected.");
      return;
    }

    if (confirm("Are you sure you want to delete this vehicle?")) {
      setOpenBackdrop(true);

      deleteVehicle(id, {
        onSuccess: async () => {
          toast.success("Vehicle deleted.");
          try {
            const { data } = await refetchSchool();
            if (data) setSelectedSchool(data);
          } catch (err) {
            console.error("Failed to refresh selected school:", err);
          }
          setOpenBackdrop(false);
          router.push("/super_admin/vehicles");
        },
        onError: () => {
          toast.error("Failed to delete vehicle.");
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
            name="registration_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex gap-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Vehicle"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Vehicle"}
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
