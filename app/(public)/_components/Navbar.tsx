"use client";

import Link from "next/link";
import { Logo } from "@/components/logo/fbc-logo/logo";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { UserDropdown } from "./Userdropdown";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

const navigationItems = [
  { name: " Home", href: "/" },
  { name: " Courses", href: "/courses" },
  { name: " Dashboard", href: "/dashboard" },
];

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container relative flex min-h-16 items-center gap-6 mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo className="size-15" />
          <span className="font-bold">Fullbright College LMS.</span>
        </Link>

        {/* Desktop Navigation*/}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-md font-medium transition-colors hover:text-primary ">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggleButton className="size-7"/>
          {isPending ? null : session ? (
            <UserDropdown email={session.user.email} image={session?.user.image ?? `https://avatar.vercel.sh/rauchg?size=30/${session?.user.email}`} name={session?.user.name && session.user.name.length > 0 ? session.user.name : session?.user.email.split("@")[0]} />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
              <Link href="/login" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
