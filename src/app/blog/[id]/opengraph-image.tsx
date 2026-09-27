import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";
import { BLOG_ARTICLES } from "@/lib/blog-data";

export const alt = "Solid Wealth article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
    return BLOG_ARTICLES.map((article) => ({ id: article.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Matches the page's own fallback so the card never describes another post.
    const article = BLOG_ARTICLES.find((entry) => entry.id === id) ?? BLOG_ARTICLES[0];
    return renderOgImage({
        eyebrow: article.category,
        title: article.title,
        subtitle: `${article.readTime} · ${article.author.name}`,
    });
}
