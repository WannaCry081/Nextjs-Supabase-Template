import { buildMetadata } from "@/lib/seo";

import { PageClient } from "./page.client";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description: "Reset your password.",
  path: "/forgot-password",
});

export default async function Page() {
  return <PageClient />;
}
