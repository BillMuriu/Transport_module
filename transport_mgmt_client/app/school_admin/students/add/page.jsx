"use client";

import { useState } from "react";
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

export default function AddStudentForm() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const schoolId = user?.school?.id;
  const stations = user?.school?.stations || [];

  const [openBackdrop, setOpenBackdrop] = useState(false);

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
                  <Input {...field} />
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
                <Input placeholder="Enter station ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
