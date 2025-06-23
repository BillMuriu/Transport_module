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
import { Textarea } from "@/components/ui/textarea";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useUpdateTemplate,
  useDeleteTemplate,
} from "../../_services/mutations";
import { API_BASE_URL } from "@/config";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().min(1, "Description is required"),
});

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
    },
  });

  const { mutate: updateTemplate, isPending: isUpdating } =
    useUpdateTemplate(id);
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/messaging/templates/${id}/`
        );
        form.reset(response.data);
      } catch (error) {
        toast.error("Failed to fetch template details.");
      }
    }

    fetchTemplate();
  }, [id, form]);

  const onSubmit = async (values) => {
    setOpenBackdrop(true);

    updateTemplate(values, {
      onSuccess: () => {
        toast.success("Template updated successfully.");
        setOpenBackdrop(false);
        router.push("/school_admin/(messaging)/sms-templates");
      },
      onError: () => {
        toast.error("Failed to update template.");
        setOpenBackdrop(false);
      },
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this template?")) {
      setOpenBackdrop(true);
      deleteTemplate(id, {
        onSuccess: () => {
          toast.success("Template deleted.");
          setOpenBackdrop(false);
          router.push("/school_admin/(messaging)/sms-templates");
        },
        onError: () => {
          toast.error("Failed to delete template.");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditing}
                    className="min-h-[150px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex gap-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Template"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Template"}
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
