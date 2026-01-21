"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been block due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot! if this a mistake contact our support",
        };
      }
    }

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    let stripePriceId: string | null = null;

    // Only create Stripe product for paid courses
    if (!validation.data.isFree && validation.data.price > 0) {
      const data = await stripe.products.create({
        name: validation.data.title,
        description: validation.data.smallDescription,
        default_price_data: {
          currency: "php",
          unit_amount: validation.data.price * 100,
        },
      });

      if (!data.default_price || typeof data.default_price !== "string") {
        return {
          status: "error",
          message: "Failed to create Stripe price",
        };
      }

      stripePriceId = data.default_price;
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id as string,
        stripePriceId: stripePriceId,
      },
    });

    return {
      status: "success",
      message: "Course created successfully!",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
