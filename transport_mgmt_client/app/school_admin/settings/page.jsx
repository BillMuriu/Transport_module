"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

const Settings = () => {
  const [phoneNumber, setPhoneNumber] = useState("+254700000000");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Control dialog state manually

  const handleSTKPush = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    // Do not close dialog automatically here
  };

  return (
    <Card className="max-w-md mx-5 mt-8">
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>
        <CardDescription>Buy SMS credits for your school</CardDescription>
      </CardHeader>

      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Buy SMSs</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Buy SMS Credits</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your phone number to receive the STK Push prompt.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={loading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSTKPush} disabled={loading}>
                {loading && <Spinner />}
                Prompt STK push
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>

      <CardFooter />
    </Card>
  );
};

export default Settings;
