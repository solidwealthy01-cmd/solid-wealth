import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Served at /robots.txt. The API routes are disallowed because they return JSON
// that would otherwise be crawled and indexed as thin pages.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: absoluteUrl("/").replace(/\/$/, ""),
    };
}
