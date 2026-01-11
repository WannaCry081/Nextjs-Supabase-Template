import { PropsWithChildren } from "react";

// Components
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/app-sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Providers
import { UserProfileProvider } from "@/components/providers/user-profile-provider";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <UserProfileProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </UserProfileProvider>
  );
}
