import { Compass, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function NotAuthorizedPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="absolute inset-x-0 h-px bg-border" />
          <Empty>
            <EmptyHeader className="items-center">
              <ShieldAlert className="mb-2 h-10 w-10 text-destructive" />
              <EmptyTitle className="font-black font-mono text-6xl">401</EmptyTitle>
              <EmptyDescription className="text-center">
                You don&apos;t have permission to view this page.
                <br />
                Please return home or explore available content.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button asChild>
                  <a href="/">
                    <Home /> Go Home
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/courses">
                    <Compass /> Explore
                  </a>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <div className="absolute inset-x-0 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}
