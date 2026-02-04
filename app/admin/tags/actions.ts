"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { tagSchema, TagSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export async function createTag(values: TagSchemaType): Promise<ApiResponse> {
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
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked. Contact support if this is a mistake.",
      };
    }

    const validation = tagSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const existingSlug = await prisma.tag.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existingSlug) {
      return {
        status: "error",
        message: "A tag with this slug already exists",
      };
    }

    await prisma.tag.create({
      data: validation.data,
    });

    revalidatePath("/admin/tags");

    return {
      status: "success",
      message: "Tag created successfully",
    };
  } catch (error) {
    console.error("Error creating tag:", error);
    return {
      status: "error",
      message: "Failed to create tag",
    };
  }
}

export async function updateTag(
  id: string,
  values: TagSchemaType
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
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked. Contact support if this is a mistake.",
      };
    }

    const validation = tagSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return {
        status: "error",
        message: "Tag not found",
      };
    }

    const existingSlug = await prisma.tag.findFirst({
      where: {
        slug: validation.data.slug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      return {
        status: "error",
        message: "A tag with this slug already exists",
      };
    }

    await prisma.tag.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath("/admin/tags");

    return {
      status: "success",
      message: "Tag updated successfully",
    };
  } catch (error) {
    console.error("Error updating tag:", error);
    return {
      status: "error",
      message: "Failed to update tag",
    };
  }
}

export async function deleteTag(id: string): Promise<ApiResponse> {
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
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      return {
        status: "error",
        message: "Request blocked. Contact support if this is a mistake.",
      };
    }

    const tag = await prisma.tag.findUnique({
      where: { id },
      select: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!tag) {
      return {
        status: "error",
        message: "Tag not found",
      };
    }

    if (tag._count.courses > 0) {
      return {
        status: "error",
        message: `Cannot delete tag with ${tag._count.courses} associated course(s). Remove courses first.`,
      };
    }

    await prisma.tag.delete({
      where: { id },
    });

    revalidatePath("/admin/tags");

    return {
      status: "success",
      message: "Tag deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return {
      status: "error",
      message: "Failed to delete tag",
    };
  }
}
