"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "./queries/mutations";
import { useFetchUserDetails } from "./queries/queries";
import { useGetSchool } from "@/app/school_admin/school-info/services/queries";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

export default function Login() {
  const [userId, setUserId] = useState(null);
  const { setTokens, setUser } = useAuthStore();
  const { setSchool } = useSchoolStore();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: login, isLoading } = useLogin();

  const { data: userDetails, isLoading: isFetchingUser } =
    useFetchUserDetails(userId);

  // ✅ Adjusted this line to access school.id
  const { data: schoolData, isLoading: isFetchingSchool } = useGetSchool(
    userDetails?.school?.id,
    {
      enabled: !!userDetails?.school?.id,
    }
  );

  async function onSubmit(values) {
    setOpenBackdrop(true);
    try {
      const loginData = await login(values);
      const userId = loginData.userId;

      if (userId) {
        setTokens({
          access: loginData.access,
          refresh: loginData.refresh,
        });
        toast.success(`Login successful!`);
        setUserId(userId);
      } else {
        toast.error("Failed to retrieve User ID.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setOpenBackdrop(false);
    }
  }

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    if (schoolData && userDetails?.user_type) {
      setSchool(schoolData);
      toast.success(`Welcome, ${userDetails.username}`);

      if (userDetails.user_type === "TRIP_TEACHER") {
        router.push("/trip_teacher");
      } else if (userDetails.user_type === "SCHOOL_ADMIN") {
        router.push("/school_admin");
      }
    }
  }, [schoolData, userDetails?.user_type]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md p-4 border rounded">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Backdrop */}
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
