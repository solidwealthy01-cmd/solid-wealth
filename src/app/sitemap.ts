import type { MetadataRoute } from "next";
import { BLOG_ARTICLES } from "@/lib/blog-data";
import { CALCULATORS } from "@/lib/calculators-meta";
import { courseLevels, createTopicSlug, getCourseTopicEntries } from "@/lib/course-curriculum";
import { MUTUAL_FUNDS_DATA } from "@/lib/mutual-funds-data";
import { absoluteUrl } from "@/lib/seo";

// Served at /sitemap.xml. Every indexable route is listed here so a crawler does
// not have to discover them by following links alone. Priorities are relative:
// the calculators are the pages this site most wants found.
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: absoluteUrl("/calculators"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: absoluteUrl("/mutual-funds"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: absoluteUrl("/research"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ];

    const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.map((calculator) => ({
        url: absoluteUrl(`/calculators/${calculator.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
    }));

    const blogRoutes: MetadataRoute.Sitemap = BLOG_ARTICLES.map((article) => ({
        url: absoluteUrl(`/blog/${article.id}`),
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const fundRoutes: MetadataRoute.Sitemap = MUTUAL_FUNDS_DATA.map((fund) => ({
        url: absoluteUrl(`/mutual-funds/${fund.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // Only the canonical slug form is listed. The route also accepts numeric
    // slugs ("/research/1"), but listing both would advertise duplicates.
    const levelRoutes: MetadataRoute.Sitemap = courseLevels.map((level) => ({
        url: absoluteUrl(`/research/${level.id}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    const topicRoutes: MetadataRoute.Sitemap = getCourseTopicEntries().map((entry) => ({
        url: absoluteUrl(`/research/${entry.level.id}/${entry.courseModule.id}/${createTopicSlug(entry.topic)}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [...staticRoutes, ...calculatorRoutes, ...blogRoutes, ...fundRoutes, ...levelRoutes, ...topicRoutes];
}
