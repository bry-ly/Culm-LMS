"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldAlert, ShieldX } from "lucide-react";

export default function UnauthorizedError() {
  const router = useRouter();

  return (
    <div className="flex h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-destructive/10 p-3">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold mt-1">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You do not have permission to view this page. Please log in with the appropriate credentials or contact your administrator.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="size-4" />Back to Home</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
