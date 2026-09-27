// One place for the site's identity, so canonicals, sitemap entries, Open Graph
// tags and structured data can never drift apart.
//
// NEXT_PUBLIC_SITE_URL overrides the host for staging or a domain change; the
// default is the production site.

import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.solidwealthindia.com").replace(/\/$/, "");
export const SITE_NAME = "Solid Wealth";
export const SITE_TAGLINE = "Reimagine money, Simple solutions";
export const DEFAULT_OG_IMAGE = "/poster.png";

export function absoluteUrl(path: string): string {
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageSeo {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    image?: string;
    type?: "website" | "article";
    publishedTime?: string;
}

// Every page gets a canonical and a matching Open Graph block. Without the
// canonical, the calculator routes below all look like near-duplicates of each
// other to a crawler and only one of them gets indexed.
export function pageMetadata({ title, description, path, keywords, image, type = "website", publishedTime }: PageSeo): Metadata {
    const url = absoluteUrl(path);
    const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
    return {
        // `absolute` opts out of the root layout's "%s | Solid Wealth" template.
        // Each title below is already written to fit the ~60 characters Google
        // shows; letting the template append to it would push it past the cut.
        title: { absolute: title },
        description,
        keywords,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            type,
            locale: "en_IN",
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            ...(publishedTime ? { publishedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

// --- Structured data -------------------------------------------------------
// Google reads these to build rich results. The calculator pages use
// SoftwareApplication + FAQPage, which is what earns the "free tool" style
// listing for queries like "sip calculator".

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/logo.png"),
        description: `${SITE_NAME} — ${SITE_TAGLINE}. Mutual fund research, financial calculators and advisory for Indian investors.`,
        areaServed: { "@type": "Country", name: "India" },
        email: "solidwealthy@gmail.com",
    };
}

export function webSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en-IN",
    };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
        })),
    };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    };
}

export function calculatorJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: absoluteUrl(path),
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    };
}
