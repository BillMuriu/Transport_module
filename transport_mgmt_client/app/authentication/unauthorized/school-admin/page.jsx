"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";

const SchoolAdminUnauthorized = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg border-yellow-400">
        <CardHeader>
          <div className="flex justify-center text-yellow-500 mb-2">
            <ShieldOff className="h-10 w-10" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            School Administrators are not authorized to access this page. Please
            contact system support if this seems incorrect.
          </p>
          {/* <Button onClick={() => router.push("/authentication/login")}>
            Back to Login
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolAdminUnauthorized;
