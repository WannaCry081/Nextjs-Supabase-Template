import {
  FrameIcon,
  SettingsIcon,
  SendIcon,
  LayoutDashboardIcon,
} from "lucide-react";

// Customize these items to match your app's navigation.
// Each section demonstrates a different sidebar pattern:
//   platform  → flat link list (NavItems)
//   drawer    → collapsible groups with sub-items (NavDrawer)
//   secondary → bottom-pinned links (NavItems, mt-auto)

export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "Platform",
    items: [
      {
        name: "Design Engineering",
        url: "#",
        icon: FrameIcon,
      },
    ],
  },
  drawer: {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        isActive: true,
        subItems: [{ title: "Overview", url: "/dashboard" }],
      },
    ],
  },
  secondary: {
    title: "Quick Access",
    items: [
      {
        name: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        name: "Feedback",
        url: "#",
        icon: SendIcon,
      },
    ],
  },
};
