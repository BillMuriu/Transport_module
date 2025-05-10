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
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

export default function Login() {
  const [userId, setUserId] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false); // Track backdrop state
  const { setTokens, setUser } = useAuthStore();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: login, isLoading } = useLogin();

  const {
    data: userDetails,
    isLoading: isFetchingUser,
    error: userError,
  } = useFetchUserDetails(userId);

  async function onSubmit(values) {
    setOpenBackdrop(true); // Show the backdrop when login starts
    try {
      console.log("Form submitted with values:", values);

      const loginData = await login(values); // returns { access, refresh, userId }
      const userId = loginData.userId;

      if (userId) {
        setTokens({
          access: loginData.access,
          refresh: loginData.refresh,
        });

        toast.success(`Login successful! User ID: ${userId}`);
        setUserId(userId);
      } else {
        toast.error("Failed to retrieve User ID.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setOpenBackdrop(false); // Hide the backdrop once the login attempt is complete
    }
  }

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
      console.log(userDetails);
      toast.success(`Welcome, ${userDetails.username}`);
      router.push("/trip_teacher"); // Redirect to dashboard after login success
    }
  }, [userDetails, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
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
