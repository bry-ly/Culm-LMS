import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="relative flex min-h-svh   flex-col items-center justify-center">
      <Card className=" max-w-87.5">
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XIcon className="size-6 text-red-600" />
            </div>
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground text-balance">
              No worries, you wount be charged, Please try again!
            </p>
          </div>
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href="/"
          >
            <ChevronLeft className="size-4" />
            Back to Homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
