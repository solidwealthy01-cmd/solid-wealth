import type { Metadata } from "next";
import { BlogDetail } from "@/components/blog/blog-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_ARTICLES } from "@/lib/blog-data";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

// Trims to the last full word inside the limit rather than mid-word.
function truncateForSearch(text: string, limit = 155): string {
    if (text.length <= limit) return text;
    const clipped = text.slice(0, limit);
    return `${clipped.slice(0, clipped.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

interface BlogPostPageProps {
    params: Promise<{ id: string }>;
}

// Prerendered so each article is crawlable HTML rather than a shell the client
// fills in.
export function generateStaticParams() {
    return BLOG_ARTICLES.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { id } = await params;
    // The page itself falls back to the first article for an unknown id, so the
    // metadata follows the same rule rather than describing a different post.
    const article = BLOG_ARTICLES.find((entry) => entry.id === id) ?? BLOG_ARTICLES[0];
    return pageMetadata({
        title: article.title,
        // Article summaries are written for the page, not for a search result;
        // anything past ~155 characters is cut off by Google anyway.
        description: truncateForSearch(article.summary),
        path: `/blog/${article.id}`,
        keywords: article.tags,
        type: "article",
        publishedTime: article.date,
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { id } = await params;
    const article = BLOG_ARTICLES.find((entry) => entry.id === id) ?? BLOG_ARTICLES[0];

    return (
        <>
            <JsonLd
                data={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: article.title,
                        description: article.summary,
                        image: article.image.startsWith("http") ? article.image : absoluteUrl(article.image),
                        datePublished: article.date,
                        dateModified: article.date,
                        articleSection: article.category,
                        keywords: article.tags.join(", "),
                        inLanguage: "en-IN",
                        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${article.id}`) },
                        author: { "@type": "Person", name: article.author.name, jobTitle: article.author.role },
                        publisher: {
                            "@type": "Organization",
                            name: SITE_NAME,
                            logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
                        },
                    },
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Blog", path: "/blog" },
                        { name: article.title, path: `/blog/${article.id}` },
                    ]),
                    ...(article.faqs?.length
                        ? [faqJsonLd(article.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })))]
                        : []),
                ]}
            />
            <BlogDetail />
        </>
    );
}
