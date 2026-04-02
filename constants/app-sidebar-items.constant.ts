import { FrameIcon, SettingsIcon, MapIcon, PieChartIcon, SendIcon } from "lucide-react";

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
