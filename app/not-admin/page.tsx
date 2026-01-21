import Link from "next/link";
import { Compass, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotAuthorizedPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="bg-border absolute inset-x-0 h-px" />
          <Empty>
            <EmptyHeader className="items-center">
              <ShieldAlert className="text-destructive mb-2 h-10 w-10" />
              <EmptyTitle className="font-mono text-6xl font-black">
                401
              </EmptyTitle>
              <EmptyDescription className="text-center">
                You don&apos;t have permission to view this page.
                <br />
                Please return home or explore available content.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/">
                    <Home /> Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/courses">
                    <Compass /> Explore
                  </Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <div className="bg-border absolute inset-x-0 h-px" />
        </div>
      </div>
    </div>
  );
}
