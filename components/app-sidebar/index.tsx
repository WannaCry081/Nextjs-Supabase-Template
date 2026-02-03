"use client";

import * as React from "react";
import { Command } from "lucide-react";

// Components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { NavUser } from "@/components/app-sidebar/nav-user";

import { NavPrimary } from "./nav-primary";

// Hooks
import { useUserProfileStore } from "@/hooks/use-user-profile-store";

// Contants
import { APP_SIDEBAR_ITEMS } from "@/constants/app-sidebar-items.constant";

// Utils
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import { NavSecondary } from "./nav-secondary";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const { data, loading, actions } = useUserProfileStore((state) => state);

  const handleSignOut = async () => {
    actions.clear();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary {...APP_SIDEBAR_ITEMS.platform} />
        <NavSecondary {...APP_SIDEBAR_ITEMS.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {loading ? (
          <Skeleton className="h-10 w-full rounded-lg" />
        ) : (
          <NavUser user={data} handleSignOut={handleSignOut} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
