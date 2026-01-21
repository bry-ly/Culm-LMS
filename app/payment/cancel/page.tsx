import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="bg-destructive/10 rounded-full p-3">
            <X className="text-destructive h-10 w-10" />
          </div>
          <CardTitle className="mt-1 text-2xl font-semibold">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            No worries, you won&apos;t be charged. Please try again!
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href="/"
          >
            <ChevronLeft className="size-4" />
            Back to Homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
