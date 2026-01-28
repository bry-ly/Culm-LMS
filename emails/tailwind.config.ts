import { type TailwindConfig, pixelBasedPreset } from "@react-email/components";

export default {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1a1a1a",
          secondary: "#f5f5f5",
          muted: "#6b7280",
          border: "#e5e5e5",
        },
      },
    },
  },
} satisfies TailwindConfig;

const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "";

export const brandAssets = {
  logo: {
    // In production: uses full URL. In dev (email:dev): uses local static folder
    src: baseUrl ? `${baseUrl}/images/icon.png` : "/static/icon.png",
    alt: "Culm LMS",
    width: 48,
    height: 48,
  },
  appName: "Culm LMS",
  supportEmail: "support@bryanpalay.me",
};
