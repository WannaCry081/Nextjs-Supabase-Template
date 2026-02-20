import type { SelectProfile } from "@/types/drizzle.types";

export const profileService = {
  me: async (): Promise<SelectProfile | null> => {
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) return null;

    const json = await response.json();

    if (!response.ok) {
      const message = typeof json.error === "string" ? json.error : "Failed to fetch user profile";
      throw new Error(message);
    }

    return json.data ?? null;
  },
};
