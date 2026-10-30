import type { MetadataRoute } from "next";
import { getResorts } from "@/lib/catalog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];
  const { resorts } = await getResorts();
  return ["/", ...resorts.map((r) => `/estaciones/${r.slug}`)].map((path) => ({
    url: new URL(path, origin).href,
    changeFrequency: "weekly",
  }));
}
