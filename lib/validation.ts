import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

export const nameSchema = z.string().min(1, "Name is required");

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export const loginPasswordSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type LoginPasswordInput = z.infer<typeof loginPasswordSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
