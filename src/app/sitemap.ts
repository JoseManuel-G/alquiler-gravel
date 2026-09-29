import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://j2data.ai", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
