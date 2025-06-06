"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const TripCoordinatorUnauthorized = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg border-red-400">
        <CardHeader>
          <div className="flex justify-center text-red-500 mb-2">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Trip Coordinators are not permitted to view this page. If you
            believe this is a mistake, please contact your administrator.
          </p>
          {/* <Button onClick={() => router.push("/authentication/login")}>
            Back to Login
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripCoordinatorUnauthorized;
