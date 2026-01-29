"use client";

import Link from "next/link";
import { Logo } from "@/components/logo/culm-logo/logo";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { UserDropdown } from "./Userdropdown";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

const navigationItems = [
  { name: " Home", href: "/" },
  { name: " Courses", href: "/courses" },
  { name: " Dashboard", href: "/dashboard" },
];

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="relative container mx-auto flex min-h-16 items-center gap-4 px-4 md:gap-6 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo className="size-10" />
          <span className="hidden font-bold sm:inline">Culm LMS.</span>
        </Link>

        <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-md hover:text-primary font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton className="hidden size-7 md:flex" />
          {isPending ? null : session ? (
            <div className="hidden md:block">
              <UserDropdown
                email={session.user.email}
                image={
                  session?.user.image ??
                  `https://avatar.vercel.sh/rauchg?size=30/${session?.user.email}`
                }
                name={
                  session?.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("@")[0]
                }
                role={session.user.role ?? ""}
              />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
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
            </div>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
