"use client";

import { LogOut, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/logo/culm-logo/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { useSignout } from "@/hooks/use-signout";
import { authClient } from "@/lib/auth-client";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const handleSignOut = useSignout();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open main menu"
          aria-expanded={open}
        >
          <motion.div
            initial={false}
            animate={open ? "open" : "closed"}
            className="flex h-6 w-6 flex-col items-center justify-center gap-1.5"
          >
            <motion.span
              className="h-[2px] w-full origin-center rounded-full bg-current"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="h-[2px] w-full rounded-full bg-current"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="h-[2px] w-full origin-center rounded-full bg-current"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.div>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[300px] flex-col pb-[env(safe-area-inset-bottom)] sm:w-[350px]"
      >
        <SheetHeader className="border-b px-6 pb-4 text-left">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Logo className="size-8" />
            <SheetTitle className="text-lg font-bold">Culm LMS.</SheetTitle>
          </Link>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-4 px-6 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground font-mono text-base font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="border-t p-6">
          {session ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        session.user.image ??
                        `https://avatar.vercel.sh/rauchg?size=30/${session.user.email}`
                      }
                      alt={
                        session.user.name && session.user.name.length > 0
                          ? session.user.name
                          : session.user.email.split("@")[0]
                      }
                    />
                    <AvatarFallback>
                      {(session.user.name && session.user.name.length > 0
                        ? session.user.name
                        : session.user.email.split("@")[0])[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session.user.name && session.user.name.length > 0
                        ? session.user.name
                        : session.user.email.split("@")[0]}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {session.user.email}
                    </span>
                  </div>
                </div>
                <ThemeToggleButton className="size-8" />
              </div>

              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
                >
                  <Shield className="size-4" />
                  Admin Dashboard
                </Link>
              )}

              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground justify-start px-0"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Theme</span>
                <ThemeToggleButton className="size-8" />
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ className: "w-full" })}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
