import {
  FrameIcon,
  SettingsIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  LayoutDashboardIcon,
  DatabaseIcon,
  UsersIcon,
} from "lucide-react";

export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "Platform",
    items: [
      {
        name: "Design Engineering",
        url: "#",
        icon: FrameIcon,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChartIcon,
      },
      {
        name: "Travel",
        url: "#",
        icon: MapIcon,
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
        subItems: [
          { title: "Overview", url: "/dashboard" },
          { title: "Analytics", url: "#" },
        ],
      },
      {
        title: "Data",
        url: "#",
        icon: DatabaseIcon,
        subItems: [
          { title: "Tables", url: "#" },
          { title: "Migrations", url: "#" },
        ],
      },
      {
        title: "Users",
        url: "#",
        icon: UsersIcon,
        subItems: [
          { title: "All Users", url: "#" },
          { title: "Roles", url: "#" },
        ],
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
