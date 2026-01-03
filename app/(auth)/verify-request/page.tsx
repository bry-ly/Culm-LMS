"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useTransition, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

function VerifyRequestContent() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function VerifyOTP() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError: () => {
            toast.error("Email verification failed/ OTP");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Please check your email
        </CardTitle>
        <CardDescription>
          We have sent you a verification email. Please check your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <div className=" flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter 6-digit code sent to your email.
          </p>
        </div>
        <Button
          className="w-full"
          onClick={VerifyOTP}
          disabled={emailPending || !isOtpCompleted}
        >
          {emailPending ? (
            <>
              <Spinner className="size 4" />
              <span>Loading...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyRequest() {
  return (
    <Suspense
      fallback={
        <Card className="w-full mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Spinner className="size-6" />
          </CardContent>
        </Card>
      }
    >
      <VerifyRequestContent />
    </Suspense>
  );
}
