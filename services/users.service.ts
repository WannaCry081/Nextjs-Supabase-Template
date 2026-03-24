import { axiosInstance } from "@/config/axios.config";
import type { SelectProfile } from "@/types/drizzle.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const usersService = {
  me: async (): Promise<SelectProfile | null> => {
    const response = await axiosInstance.get(API_ROUTES.USERS.ME);
    return response.data;
  },
};
