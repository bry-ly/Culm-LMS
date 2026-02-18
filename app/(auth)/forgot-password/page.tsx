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
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit() {
    startTransition(async () => {
      await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => {
            setIsSent(true);
            toast.success("Password reset email sent");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to send reset email");
          },
        },
      });
    });
  }

  if (isSent) {
    return (
      <Card className="bg-pattern-striped mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="size-8 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">
            Check your email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Click the link in the email to reset your password. If you
            don&apos;t see the email, check your spam folder.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 size-4" />
              Back to login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-pattern-striped mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Forgot password?
        </CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="bg-secondary pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={pending || !email}
          className="w-full"
        >
          {pending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Sending...
            </>
          ) : (
            "Send reset link"
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
