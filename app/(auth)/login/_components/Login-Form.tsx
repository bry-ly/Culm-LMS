"use client";
import { Google, Github } from "@aliimam/logos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTransition, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

function getLastMethod() {
  if (typeof window === "undefined") return null;
  return authClient.getLastUsedLoginMethod();
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const lastMethod = useSyncExternalStore(
    subscribeToStorage,
    getLastMethod,
    () => null
  );
  const isOAuthPending = githubPending || googlePending;

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected... ");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirected... ");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email successfully sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error sending email");
          },
        },
      });
    });
  }

  return (
    <Card className="bg-pattern-striped">
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Login with your Github or Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Button
              onClick={signInWithGithub}
              className="w-full"
              variant="default"
              disabled={isOAuthPending}
            >
              {githubPending ? (
                <>
                  <Spinner className="mr-2" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Github className="size-4" />
                  <span>Sign in with Github</span>
                </>
              )}
            </Button>
            {lastMethod === "github" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px]"
              >
                Last used
              </Badge>
            )}
          </div>
          <div className="relative">
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              variant="default"
              disabled={isOAuthPending}
            >
              {googlePending ? (
                <>
                  <Spinner className="mr-2" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Google className="size-4" />
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>
            {lastMethod === "google" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px]"
              >
                Last used
              </Badge>
            )}
          </div>
        </div>
        <div className="flex w-full items-center gap-4 text-sm">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground">Or Continue With</span>
          <div className="bg-border h-px flex-1" />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-secondary"
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Button
              onClick={signInWithEmail}
              disabled={emailPending}
              className="w-full"
            >
              {emailPending ? (
                <>
                  <Spinner className="size-4" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Continue with Email</span>
                </>
              )}
            </Button>
            {lastMethod === "email-otp" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px]"
              >
                Last used
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
