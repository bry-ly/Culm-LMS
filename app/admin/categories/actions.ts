"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { categorySchema, CategorySchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export async function createCategory(
  values: CategorySchemaType
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

    const validation = categorySchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const existingSlug = await prisma.category.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existingSlug) {
      return {
        status: "error",
        message: "A category with this slug already exists",
      };
    }

    await prisma.category.create({
      data: validation.data,
    });

    revalidatePath("/admin/categories");

    return {
      status: "success",
      message: "Category created successfully",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      status: "error",
      message: "Failed to create category",
    };
  }
}

export async function updateCategory(
  id: string,
  values: CategorySchemaType
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

    const validation = categorySchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return {
        status: "error",
        message: "Category not found",
      };
    }

    const existingSlug = await prisma.category.findFirst({
      where: {
        slug: validation.data.slug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      return {
        status: "error",
        message: "A category with this slug already exists",
      };
    }

    await prisma.category.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath("/admin/categories");

    return {
      status: "success",
      message: "Category updated successfully",
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      status: "error",
      message: "Failed to update category",
    };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
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

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!category) {
      return {
        status: "error",
        message: "Category not found",
      };
    }

    if (category._count.courses > 0) {
      return {
        status: "error",
        message: `Cannot delete category with ${category._count.courses} associated course(s). Remove courses first.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");

    return {
      status: "success",
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      status: "error",
      message: "Failed to delete category",
    };
  }
}
