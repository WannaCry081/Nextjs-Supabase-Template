# Form Validation

Build type-safe, validated forms with Zod schemas that provide both compile-time and runtime validation.

## The Problem

Without centralized validation schemas, different forms have different rules:

```typescript
// ❌ Scattered validation logic
const email = form.watch("email");
if (!email.includes("@")) {
  // invalid
}

// Later, another form:
if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  // different validation!
}
```

**Solution:** Define schemas once in `common/schemas/auth.schema.ts`.

## How It Works

Centralized form validation schemas using Zod ensure type-safe, reusable validation across auth forms:

```typescript
// common/schemas/auth.schema.ts
import { z } from "zod";

const emailSchema = z.email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
const nameSchema = z.string().min(2, "Name must be at least 2 characters long");
```

## Available Schemas

### Login Schema

```typescript
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Register Schema

```typescript
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```

### Forgot Password Schema

```typescript
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
```

### Reset Password Schema

```typescript
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
```

## Usage in Forms

### Basic Setup

```typescript
// app/(auth)/login/page.client.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/common/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PageClient = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        {...form.register("email")}
        type="email"
        placeholder="Email"
      />
      {form.formState.errors.email && (
        <p className="text-red-500">{form.formState.errors.email.message}</p>
      )}

      <Input
        {...form.register("password")}
        type="password"
        placeholder="Password"
      />
      {form.formState.errors.password && (
        <p className="text-red-500">{form.formState.errors.password.message}</p>
      )}

      <Button type="submit">Sign In</Button>
    </form>
  );
};
```

### With Custom Components

```typescript
// app/(auth)/login/page.client.tsx
import { Controller } from "react-hook-form";
import { PasswordInput } from "@/components/shared/password-input";

export const PageClient = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Email field */}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="email"
            placeholder="Email"
            aria-invalid={fieldState.invalid}
          />
        )}
      />

      {/* Password with show/hide */}
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <PasswordInput
            {...field}
            placeholder="Password"
            aria-invalid={fieldState.invalid}
          />
        )}
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
```

## Form Submission Handler

```typescript
const onSubmit = async (values: LoginFormValues) => {
  startTransition(async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        toast.error(AUTH_ERRORS.LOGIN_FAILED, {
          description: AUTH_ERRORS.LOGIN_FAILED_DESC,
        });
        return;
      }

      toast.success(AUTH_SUCCESS.LOGIN_SUCCESS, {
        description: AUTH_SUCCESS.LOGIN_SUCCESS_DESC,
      });

      router.replace(PROTECTED_ROUTES.DASHBOARD);
    } catch (error) {
      console.error(\"Login error:\", error);
      toast.error(API_ERRORS.GENERIC, {
        description: API_ERRORS.GENERIC_DESC,
      });
    }
  });
};
```

## Creating Custom Field Schemas

Extend base schemas for specific validation needs:

```typescript
// Reusable field schemas
const emailSchema = z
  .string()
  .email(\"Please enter a valid email address\")
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, \"Password must be at least 8 characters\")
  .regex(/[A-Z]/, \"Password must contain uppercase letter\")
  .regex(/[0-9]/, \"Password must contain number\");

const urlSchema = z
  .string()
  .url(\"Please enter a valid URL\")
  .optional();

// Use in schemas
export const updateProfileSchema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
  website: urlSchema,
});
```

## Conditional Validation

For complex validation logic:

```typescript
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: \"Passwords don't match\",
    path: [\"confirmPassword\"],
  });
```

## Type Inference

All schema types are inferred for complete type safety:

```typescript
import type { LoginFormValues } from \"@/common/schemas/auth.schema\";

// TypeScript knows the exact shape
const handleLogin = (values: LoginFormValues) => {
  // values.email is string
  // values.password is string
  // Any other field causes a type error
};
```

## Benefits

- **Single Source of Truth**: All validation rules defined once
- **Type Safety**: Form values fully typed from schema
- **Reusable Schemas**: Common fields shared across forms
- **Consistency**: Same validation rules everywhere
- **Maintainability**: Update validation once, affects all forms
- **Better UX**: Clear error messages from Zod
- **DRY Principle**: No duplicated validation logic

## Related

- [HTTP Status & Messages](/patterns/http-status) - Error messaging
- [API Response & Error Handling](/patterns/api-response) - Server-side validation
