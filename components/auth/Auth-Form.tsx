"use client";

import { Google, Github } from "@aliimam/logos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Lock, Mail, Sparkles, User, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTransition, useState, useSyncExternalStore, Suspense } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getLastMethod() {
  if (typeof window === "undefined") return null;
  return authClient.getLastUsedLoginMethod();
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function OAuthButtons({ isLogin }: { isLogin: boolean }) {
  const [githubPending, startGithub] = useTransition();
  const [googlePending, startGoogle] = useTransition();
  const lastMethod = useSyncExternalStore(
    subscribeToStorage,
    getLastMethod,
    () => null
  );
  const isPending = githubPending || googlePending;
  const action = isLogin ? "Sign in" : "Sign up";

  const handleOAuth = (
    provider: "github" | "google",
    start: typeof startGithub
  ) => {
    start(async () => {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => toast.success(`${action}ed with ${provider}`),
          onError: (err: { error: { message: string } }) =>
            toast.error(err.error.message),
        },
      });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {[
        { provider: "github" as const, Icon: Github, pending: githubPending },
        { provider: "google" as const, Icon: Google, pending: googlePending },
      ].map(({ provider, Icon, pending }) => (
        <div key={provider} className="relative">
          <Button
            onClick={() =>
              handleOAuth(
                provider,
                provider === "github" ? startGithub : startGoogle
              )
            }
            className="w-full"
            disabled={isPending}
          >
            {pending ? (
              <>
                <Spinner className="mr-2" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Icon className="size-4" />
                <span>
                  {action} with {provider}
                </span>
              </>
            )}
          </Button>
          {lastMethod === provider && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px]"
            >
              Last used
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex w-full items-center gap-4 text-sm">
      <div className="bg-border h-px flex-1" />
      <span className="text-muted-foreground">Or Continue With</span>
      <div className="bg-border h-px flex-1" />
    </div>
  );
}

interface AuthTabsProps {
  isLogin: boolean;
  email: string;
  setEmail: (e: string) => void;
  password: string;
  setPassword: (e: string) => void;
  name: string;
  setName: (e: string) => void;
}

function AuthTabs({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
}: AuthTabsProps) {
  const router = useRouter();
  const [magicPending, startMagic] = useTransition();
  const [passwordPending, startPassword] = useTransition();

  const handleMagic = () => {
    startMagic(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: isLogin ? "sign-in" : "email-verification",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              isLogin ? "Magic link sent" : "Verification email sent"
            );
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => toast.error("Error sending email"),
        },
      });
    });
  };

  const handlePassword = () => {
    startPassword(async () => {
      const action = isLogin
        ? authClient.signIn.email({ email, password, callbackURL: "/" })
        : authClient.signUp.email({ email, password, name, callbackURL: "/" });

      await action;
    });
  };

  return (
    <Tabs defaultValue="magic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="magic" className="flex items-center gap-2">
          <Sparkles className="size-4" />
          Magic Link
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="size-4" />
          Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="magic" className="mt-4 space-y-3">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-2.5 left-3 size-4" />
              <Input
                id="name"
                placeholder="John Doe"
                className="bg-secondary pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email-magic">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              id="email-magic"
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
          onClick={handleMagic}
          disabled={magicPending || !email}
          className="w-full"
        >
          {magicPending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              {isLogin ? "Send Magic Link" : "Sign up with Magic Link"}
            </>
          )}
        </Button>
      </TabsContent>

      <TabsContent value="password" className="mt-4 space-y-3">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name-password">Name</Label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-2.5 left-3 size-4" />
              <Input
                id="name-password"
                placeholder="John Doe"
                className="bg-secondary pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email-password">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              id="email-password"
              type="email"
              placeholder="m@example.com"
              className="bg-secondary pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {isLogin && (
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary text-xs"
              >
                Forgot password?
              </Link>
            )}
          </div>
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
        <Button
          onClick={handlePassword}
          disabled={passwordPending || !email || !password}
          className="w-full"
        >
          {passwordPending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Loading...
            </>
          ) : (
            <>
              <Lock className="mr-2 size-4" />
              {isLogin ? "Sign In" : "Create Account"}
            </>
          )}
        </Button>
      </TabsContent>
    </Tabs>
  );
}

function AuthFormContent({ isLogin }: { isLogin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="bg-pattern-striped bg-card mx-auto w-full max-w-md space-y-6 rounded-lg border p-6 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">
          {isLogin ? "Welcome Back!" : "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? "Login with your account"
            : "Start your learning journey with Culm LMS"}
        </p>
      </div>

      <OAuthButtons isLogin={isLogin} />
      <Divider />

      <AuthTabs
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
      />

      <div className="text-muted-foreground text-center text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="text-primary hover:underline"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}

export function AuthForm({ isLogin }: { isLogin: boolean }) {
  return (
    <Suspense fallback={null}>
      <AuthFormContent isLogin={isLogin} />
    </Suspense>
  );
}
