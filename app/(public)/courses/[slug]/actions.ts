"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import Stripe from "stripe";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function EnrollmentCourseAction(
  courseId: string
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    let stripeCustomerId: string;

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status == "Active") {
        return {
          status: "success",
          message: "Your are already enrolled in this course",
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Active",
          },
        });
      }

      const checkOutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "php",
              product_data: {
                name: course.title,
              },
              unit_amount: Math.round(course.price * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success?=${enrollment.id}`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel?slug=${course.slug}`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkOutSession.url,
      };
    });

    // Return the checkout URL instead of redirecting
    // This allows the client to handle the redirect and avoid redirect errors
    return {
      status: "success",
      checkoutUrl: result.checkoutUrl as string,
      message: "Redirecting to checkout...",
    };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error, please try again later.",
      };
    }

    return {
      status: "error",
      message: "Failed to enroll courses",
    };
  }
}
