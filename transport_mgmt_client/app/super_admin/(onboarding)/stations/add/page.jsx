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
  useUpdateStation,
  useDeleteStation,
} from "@/app/school_admin/stations/services/mutations";

import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";
import { useSelectedSchoolStore } from "@/stores/useSelectedSchoolStore"; // ✅ use this instead of useAuthStore

const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  route_id: z.string().uuid("Route must be a valid UUID"),
  latitude: z.coerce
    .number({ required_error: "Latitude is required" })
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),
  longitude: z.coerce
    .number({ required_error: "Longitude is required" })
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
});

export default function EditStationPage() {
  const { id } = useParams();
  const router = useRouter();
  const school = useSelectedSchoolStore((s) => s.school); // ✅ pulled from selected school store
  const schoolId = school?.id;

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      route_id: "",
      latitude: 0,
      longitude: 0,
      order: 1,
    },
  });

  const { mutate: updateStation, isPending: isUpdating } = useUpdateStation(id);
  const { mutate: deleteStation, isPending: isDeleting } = useDeleteStation();

  useEffect(() => {
    async function fetchStation() {
      try {
        const response = await axios.get(`${API_BASE_URL}/stations/${id}/`);
        form.reset({
          ...response.data,
          latitude: Number(response.data.latitude),
          longitude: Number(response.data.longitude),
          order: Number(response.data.order),
        });
      } catch (error) {
        toast.error("Failed to fetch station details.");
      }
    }

    fetchStation();
  }, [id, form]);

  const onSubmit = (values) => {
    if (!schoolId) {
      toast.error("No school selected.");
      return;
    }

    const payload = { ...values };

    setOpenBackdrop(true);

    updateStation(payload, {
      onSuccess: () => {
        toast.success("Station updated successfully.");
        setOpenBackdrop(false);
        router.push("/super_admin/stations");
      },
      onError: () => {
        toast.error("Failed to update station.");
        setOpenBackdrop(false);
      },
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this station?")) {
      deleteStation(id, {
        onSuccess: () => {
          toast.success("Station deleted.");
          router.push("/super_admin/stations");
        },
        onError: () => {
          toast.error("Failed to delete station.");
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
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
                <FormLabel>Route (UUID)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
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
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
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
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
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
                {isUpdating ? "Updating..." : "Update Station"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Station"}
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
