"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { magicLinkSchema, loginPasswordSchema } from "@/lib/validation";

export function LoginForm() {
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  const [tab, setTab] = useState("magic");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const callback = useSearchParams().get("callback") || "/dashboard";

  useEffect(() => {
    const method = authClient.getLastUsedLoginMethod?.();
    setLastMethod(method);
    // Auto-select tab based on last method
    if (method === "email") {
      setTab("password");
    } else if (method === "magic-link") {
      setTab("magic");
    }
  }, []);

  const handleMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const emailVal = (form.elements.namedItem("email") as HTMLInputElement)
      .value;
    const result = magicLinkSchema.safeParse({ email: emailVal });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const { error } = await (
        authClient.signIn as unknown as {
          magicLink: (opts: {
            email: string;
            callbackURL: string;
          }) => Promise<{ error?: Error }>;
        }
      ).magicLink({
        email: emailVal,
        callbackURL: callback,
      });
      if (error) throw error;
      setEmail(emailVal);
      setShowVerify(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      remember: (form.elements.namedItem("remember") as HTMLInputElement)
        ?.checked,
    };
    const result = loginPasswordSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
        callbackURL: callback,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push(callback);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  if (showVerify) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">We sent a magic link to {email}</p>
        <Button onClick={() => setShowVerify(false)}>Back to login</Button>
      </div>
    );
  }

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider, callbackURL: callback });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OAuth failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="default"
          className="relative flex-1"
          onClick={() => handleOAuth("google")}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
          {lastMethod === "google" && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-1 px-1.5 py-0 text-[10px]"
            >
              Last used
            </Badge>
          )}
        </Button>
        <Button
          type="button"
          variant="default"
          className="relative flex-1"
          onClick={() => handleOAuth("github")}
          disabled={loading}
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
              transform="scale(64)"
              fill="currentColor"
            />
          </svg>
          GitHub
          {lastMethod === "github" && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-1 px-1.5 py-0 text-[10px]"
            >
              Last used
            </Badge>
          )}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with email
          </span>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="magic" className="relative">
            Magic Link
            {lastMethod === "magic-link" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-1 px-1.5 py-0 text-[10px]"
              >
                Last used
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="password" className="relative">
            Password
            {lastMethod === "email" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-1 px-1.5 py-0 text-[10px]"
              >
                Last used
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="magic" className="space-y-4">
          <form onSubmit={handleMagic} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email">Email</Label>
              <Input
                id="magic-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="size-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <form onSubmit={handlePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pwd-email">Email</Label>
              <Input
                id="pwd-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  required
                  className="bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" name="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <Send className="size-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
