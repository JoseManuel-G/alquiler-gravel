import type { MetadataRoute } from "next";

const siteUrl = "https://alquilergravelmadrid.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
