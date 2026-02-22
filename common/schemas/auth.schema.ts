import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
const nameSchema = z.string().min(2, "Name must be at least 2 characters long");

/** Login form validation */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Register form validation */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

/** Forgot password form validation */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/** Reset password form validation with confirmation check */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
