import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = [
    { path: "", priority: 1 },
    { path: "/galeria", priority: 0.9 },
    { path: "/gjeneratat", priority: 0.8 },
    { path: "/regjistrohu", priority: 0.9 },
    { path: "/pyetjet", priority: 0.7 },
    { path: "/kontakti", priority: 0.8 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
}
