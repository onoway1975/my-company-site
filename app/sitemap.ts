import { MetadataRoute } from "next";
import { works } from "./data/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ciraf.jp";

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/service/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/works/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...workPages];
}
