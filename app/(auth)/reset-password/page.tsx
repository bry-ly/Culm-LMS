"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, Suspense } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      await authClient.resetPassword({
        newPassword: password,
        token: token || undefined,
        fetchOptions: {
          onSuccess: () => {
            setIsSuccess(true);
            toast.success("Password reset successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to reset password");
          },
        },
      });
    });
  }

  if (!token) {
    return (
      <Card className="bg-pattern-striped mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/forgot-password">Request new reset link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="bg-pattern-striped mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="size-8 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">
            Password reset!
          </CardTitle>
          <CardDescription>
            Your password has been reset successfully. You can now sign in with
            your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-pattern-striped mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Reset password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary pl-9"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={pending || !password || !confirmPassword}
          className="w-full"
        >
          {pending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 size-4" />
            Back to login
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
