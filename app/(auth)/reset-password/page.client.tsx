"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Activity, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

// Utils
import { getSupabaseClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/shared/password-input";

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const PageClient = () => {
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      startTransition(async () => {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (error) {
          toast.error("Reset password failed", {
            description: "Please check your credentials and try again.",
          });
          return;
        }

        toast.success("Password reset successful", {
          description: "Your password has been updated successfully.",
        });

        form.reset();
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "There was an issue resetting your password. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FieldGroup>
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
