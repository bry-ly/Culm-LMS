import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Card className="max-w-87.5">
        <CardContent className="space-y-4">
          <div className=" flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="size-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successfully</h2>
            <p className="text-sm mt-2 text-muted-foreground text-balance">Thank you for purchasing, your payment was successful, you should now have access to the course </p>
          </div>
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href="/dashboard"
          >
            <ChevronLeft className="size-4" />
            Go to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
