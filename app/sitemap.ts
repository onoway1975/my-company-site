import { MetadataRoute } from "next";
import { works } from "./data/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ciraf.jp";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/about/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/service/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/works/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy/`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}/`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...workPages];
}
