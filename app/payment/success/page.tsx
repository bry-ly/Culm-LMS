import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-green-100 p-3">
            <CheckIcon className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold mt-1">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            Thank you for purchasing! Your payment was successful, and you should now have access to the course.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href="/dashboard"
          >
            <ChevronLeft className="size-4" />
            Go to dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
