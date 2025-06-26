"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Check } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useCreateInvitation } from "../services/mutations";

const formSchema = z.object({
  user_type: z.enum(["SCHOOL_ADMIN", "TRIP_TEACHER", "SUPER_ADMIN"]),
});

export default function GenerateInvitation() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_type: "SUPER_ADMIN",
    },
  });

  const { mutateAsync: createInvitation, isLoading } = useCreateInvitation();

  async function onSubmit(values) {
    setOpenBackdrop(true);
    setGeneratedLink("");
    setCopied(false);

    try {
      const data = await createInvitation({
        user_type: values.user_type,
      });

      setGeneratedLink(data.invite_link);
      toast.success("Invitation link generated!");
    } catch (error) {
      toast.error("Failed to generate invitation link.");
    } finally {
      setOpenBackdrop(false);
    }
  }

  const handleCopy = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Copied to clipboard!");

      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-1 text-foreground">
            Generate New Invitation
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new invitation link for a user
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="user_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="SCHOOL_ADMIN">
                          School Admin
                        </SelectItem>
                        <SelectItem value="TRIP_TEACHER">
                          Trip Teacher
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button asChild>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex gap-2 items-center justify-center ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>
                    {isLoading ? "Generating..." : "Generate Invitation Link"}
                  </span>
                </button>
              </Button>
            </form>
          </Form>

          {generatedLink && (
            <div className="mt-6 flex items-center gap-3 w-full max-w-lg relative">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-3 py-2 pr-12 overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 dark:border-gray-600 focus:outline-none"
                aria-label="Generated invitation link"
                onFocus={(e) => e.target.select()}
                style={{
                  maskImage:
                    "linear-gradient(to right, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black 60%, transparent 100%)",
                }}
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 p-0 rounded-md"
                aria-label="Copy invitation link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
