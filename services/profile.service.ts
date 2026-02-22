import type { SelectProfile } from "@/types/drizzle.types";
import { API_ROUTES } from "@/constants/routes.constant";
import { API_HEADERS } from "@/constants/api.constant";

/**
 * Profile Service
 * Handles all profile-related API requests
 */
export const profileService = {
  /**
   * Fetches the current authenticated user's profile
   * @returns Profile data or null if not found/unauthorized
   */
  me: async (): Promise<SelectProfile | null> => {
    const response = await fetch(API_ROUTES.USERS_ME, {
      method: "GET",
      headers: API_HEADERS,
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
