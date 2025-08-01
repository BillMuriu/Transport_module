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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSendGradeMessage } from "../_services/mutations";
import { useTemplates } from "../sms-templates/_services/queries";

const gradeMessageSchema = z.object({
  grade_level: z.string().min(1, "Grade level is required"),
  msg_type: z.enum(["Promotional", "Transactional"]),
  content: z.string().min(5, "Message content is required"),
});

export default function SendGradeMessageForm() {
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { data: templates } = useTemplates();

  const form = useForm({
    resolver: zodResolver(gradeMessageSchema),
    defaultValues: {
      grade_level: "",
      msg_type: "Promotional",
      content: "",
    },
  });

  const { mutate: sendMessage, isPending } = useSendGradeMessage();

  function onSubmit(values) {
    setOpenBackdrop(true);

    sendMessage(values, {
      onSuccess: () => {
        toast.success("Message sent successfully.");
        setOpenBackdrop(false);
        router.push("/school_admin/sms-reports");
      },
      onError: () => {
        toast.error("Failed to send messages.");
        setOpenBackdrop(false);
      },
    });
  }

  return (
    <div className="w-full max-w-xl mx-auto py-10 px-4">
      <div className="mb-6">
        <label className="text-sm font-medium">
          Message Template (Optional)
        </label>
        <Select
          onValueChange={(value) => {
            setSelectedTemplateId(value);
            const selectedTemplate = templates?.find((t) => t.id === value);
            if (selectedTemplate) {
              form.setValue("content", selectedTemplate.content);
            }
          }}
          value={selectedTemplateId}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a template..." />
          </SelectTrigger>
          <SelectContent>
            {templates?.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="grade_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 9 }, (_, i) => (
                        <SelectItem
                          key={`grade_${i + 1}`}
                          value={`grade_${i + 1}`}
                        >
                          Grade {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="msg_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Promotional">Promotional</SelectItem>
                      <SelectItem value="Transactional">
                        Transactional
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Message Content</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Write your message here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
