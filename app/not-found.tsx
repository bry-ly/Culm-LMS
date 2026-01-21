import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Compass, Ghost, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="bg-border absolute inset-x-0 h-px" />
          <Empty>
            <EmptyHeader className="items-center">
              <Ghost className="text-muted-foreground mb-2 h-10 w-10" />
              <EmptyTitle className="font-mono text-6xl font-black">
                404
              </EmptyTitle>
              <EmptyDescription className="text-center">
                The page you&apos;re looking for might have been removed or
                never existed.
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
