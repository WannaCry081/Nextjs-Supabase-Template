import { Frame, Settings, Map, PieChart, Send } from "lucide-react";

export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "Platform",
    items: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  },
  secondary: {
    title: "Secondary",
    items: [
      {
        name: "Settings",
        url: "#",
        icon: Settings,
      },
      {
        name: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  },
} as const;
