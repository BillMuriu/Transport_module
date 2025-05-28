"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useUpdateSchool } from "./services/mutations";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  contact_person: z.string().min(1),
});

export default function EditSchoolPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.school?.id;

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone_number: "",
      email: "",
      contact_person: "",
    },
  });

  const { mutate: updateSchool, isPending: isUpdating } =
    useUpdateSchool(schoolId);

  useEffect(() => {
    async function fetchSchool() {
      if (!schoolId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/schools/${schoolId}/`
        );
        form.reset(response.data);
      } catch (error) {
        toast.error("Failed to fetch school details.");
      }
    }

    fetchSchool();
  }, [schoolId, form]);

  const onSubmit = (values) => {
    if (!schoolId) {
      toast.error("No school assigned to this user.");
      return;
    }

    setOpenBackdrop(true);

    updateSchool(values, {
      onSuccess: () => {
        toast.success("School updated successfully.");
        setOpenBackdrop(false);
        router.refresh();
      },
      onError: () => {
        toast.error("Failed to update school.");
        setOpenBackdrop(false);
      },
    });
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
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
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
                  <Input type="tel" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update School"}
            </Button>
          )}
        </form>
      </Form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
