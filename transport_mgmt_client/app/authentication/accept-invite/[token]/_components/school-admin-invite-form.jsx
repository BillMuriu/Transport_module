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
import { Separator } from "@/components/ui/separator";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useCreateUser,
  useCreateSchool,
  useUpdateUser,
} from "../services/mutations";

const schoolAdminInviteSchema = z
  .object({
    // User fields
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password is required"),
    phone_number: z.string().min(10, "Phone number is required"),

    // School fields
    school: z.object({
      name: z.string().min(1, "School name is required"),
      address: z.string().min(1, "School address is required"),
      phone_number: z.string().min(10, "School phone number is required"),
      email: z.string().email("Invalid school email"),
      contact_person: z.string().min(1, "Contact person is required"),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function SchoolAdminInviteForm({ token, invitation }) {
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: createSchool } = useCreateSchool();
  const { mutateAsync: updateUser } = useUpdateUser();

  const form = useForm({
    resolver: zodResolver(schoolAdminInviteSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      school: {
        name: "",
        address: "",
        phone_number: "",
        email: "",
        contact_person: "",
      },
    },
  });

  async function onSubmit(values) {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    setOpenBackdrop(true);

    try {
      // Step 1: Accept invitation (create user) - same as regular invitation
      const { confirm_password, school: schoolData, ...userData } = values;
      userData.token = token;

      console.log("Step 1: Creating user with invitation token...");
      const createdUser = await createUser(userData);
      console.log("User created:", createdUser);

      if (!createdUser || !createdUser.user?.id) {
        throw new Error("Failed to create user or get user ID");
      }

      const userId = createdUser.user.id;

      // Step 2: Create school
      console.log("Step 2: Creating school...");
      const createdSchool = await createSchool(schoolData);
      console.log("School created:", createdSchool);

      if (!createdSchool || !createdSchool.id) {
        throw new Error("Failed to create school or get school ID");
      }

      const schoolId = createdSchool.id;

      // Step 3: Update user to link with school
      console.log("Step 3: Linking user to school...");
      const updateData = {
        email: userData.email,
        username: userData.username,
        phone_number: userData.phone_number,
        user_type: createdUser.user.user_type, // Maintain what was set during invitation creation
        school: schoolId,
        is_active: true, // Ensure user is active
      };

      console.log("Update data being sent:", updateData);
      const updatedUser = await updateUser({
        id: userId,
        data: updateData,
      });
      console.log("User update response:", updatedUser);

      console.log("School admin setup completed successfully!");
      toast.success("Account and school created successfully!");
      router.push("/authentication/login");
    } catch (error) {
      console.error("Error in setup:", error);

      // More specific error messages based on the stage
      if (error?.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to complete setup. Please try again.");
      }
    } finally {
      setOpenBackdrop(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* User Account Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Account Information</h2>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. john_doe" {...field} />
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
                    <Input
                      type="email"
                      placeholder="e.g. john@example.com"
                      {...field}
                    />
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
                    <Input placeholder="e.g. +254XXXXXXXXX" {...field} />
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* School Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">School Information</h2>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="school.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school.phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +254XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. school@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school.contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Account & School
        </Button>
      </form>

      <Backdrop open={openBackdrop} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
}
