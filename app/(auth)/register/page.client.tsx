"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Activity, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

// Utils
import { getSupabaseClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/shared/password-input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const PageClient = () => {
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      startTransition(async () => {
        const { error } = await supabase.auth.signUp({
          ...values,
          options: {
            data: {
              ...values,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          toast.error("Registration failed", {
            description: "Please check your credentials and try again.",
          });
          return;
        }

        toast.success("Registration successful", {
          description: "Please check your email to verify your account.",
        });

        form.reset();
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "There was an issue registering you. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Register with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <Activity mode={fieldState.error ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <Activity mode={fieldState.error ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="password"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    <Activity mode={fieldState.error ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
};
