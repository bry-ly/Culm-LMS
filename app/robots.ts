import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.BETTER_AUTH_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/courses/*"],
        disallow: ["/admin/*", "/dashboard/*", "/api/*", "/payment/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
