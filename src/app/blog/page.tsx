import type { Metadata } from "next";
import { BlogHub } from "@/components/blog/blog-hub";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_ARTICLES } from "@/lib/blog-data";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Investment Blog — Mutual Funds, SIP & Market Insights",
    description:
        "Read Solid Wealth's investment blog for mutual fund analysis, SIP strategy, bond explainers, commodities and NRI tax guides written for Indian investors.",
    path: "/blog",
    keywords: [
        "investment blog india",
        "mutual fund blog",
        "sip investment articles",
        "stock market insights india",
        "personal finance blog india",
    ],
});

export default function BlogPage() {
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Blog", path: "/blog" },
                    ]),
                    {
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        name: `${SITE_NAME} Investment Blog`,
                        url: absoluteUrl("/blog"),
                        inLanguage: "en-IN",
                        blogPost: BLOG_ARTICLES.slice(0, 10).map((article) => ({
                            "@type": "BlogPosting",
                            headline: article.title,
                            description: article.summary,
                            url: absoluteUrl(`/blog/${article.id}`),
                            datePublished: article.date,
                            author: { "@type": "Person", name: article.author.name },
                        })),
                    },
                ]}
            />
            <BlogHub />
        </>
    );
}
