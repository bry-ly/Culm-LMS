import { render } from "@react-email/components";
import EnrollmentConfirmationEmail from "@/emails/enrollment-confirmation";
import PaymentReceiptEmail from "@/emails/payment-receipt";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

function formatAmount(amountInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const customerId = session.customer as string;

    if (!courseId) {
      throw new Error("Course id not found...");
    }

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      throw new Error("User not found...");
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, slug: true },
    });

    if (!course) {
      throw new Error("Course not found...");
    }

    await prisma.enrollment.update({
      where: {
        id: session.metadata?.enrollmentId as string,
      },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: session.amount_total as number,
        status: "Active",
      },
    });

    const baseUrl = env.BETTER_AUTH_URL;
    const courseLink = `${baseUrl}/dashboard/${course.slug}`;
    const transactionDate = formatDate(new Date());
    const amount = formatAmount(session.amount_total ?? 0);

    const enrollmentHtml = await render(
      EnrollmentConfirmationEmail({
        userName: user.name,
        courseTitle: course.title,
        courseLink,
      })
    );
    const enrollmentText = await render(
      EnrollmentConfirmationEmail({
        userName: user.name,
        courseTitle: course.title,
        courseLink,
      }),
      { plainText: true }
    );

    const receiptHtml = await render(
      PaymentReceiptEmail({
        userName: user.name,
        courseTitle: course.title,
        amount,
        transactionDate,
        transactionId: session.payment_intent as string,
      })
    );
    const receiptText = await render(
      PaymentReceiptEmail({
        userName: user.name,
        courseTitle: course.title,
        amount,
        transactionDate,
        transactionId: session.payment_intent as string,
      }),
      { plainText: true }
    );

    await Promise.all([
      resend.emails.send({
        from: "Culm LMS <send@bryanpalay.me>",
        to: [user.email],
        subject: `You're enrolled in ${course.title}!`,
        html: enrollmentHtml,
        text: enrollmentText,
      }),
      resend.emails.send({
        from: "Culm LMS <send@bryanpalay.me>",
        to: [user.email],
        subject: `Payment Receipt - ${course.title}`,
        html: receiptHtml,
        text: receiptText,
      }),
    ]);
  }

  return new Response(null, { status: 200 });
}
