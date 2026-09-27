import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Sora, Righteous } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ChatbotFloat } from "@/components/ui/chatbot-float";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_NAME, SITE_URL, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    display: "swap",
});
const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});
const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-dm-mono",
    display: "swap",
});
const righteous = Righteous({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-righteous",
    display: "swap",
});
export const metadata: Metadata = {
    // metadataBase turns every relative path below (and in each page) into an
    // absolute URL, which Open Graph and canonical tags both require.
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Solid Wealth | Reimagine money, Simple solutions",
        // Pages set their own full title; this frames anything that does not.
        template: "%s | Solid Wealth",
    },
    description: "Next-generation wealth management with secure investing, smart analytics, instant transfers, and premium advisory services.",
    applicationName: SITE_NAME,
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_IN",
        url: SITE_URL,
        title: "Solid Wealth | Reimagine money, Simple solutions",
        description: "Mutual fund research, free financial calculators and advisory for Indian investors.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Solid Wealth | Reimagine money, Simple solutions",
        description: "Mutual fund research, free financial calculators and advisory for Indian investors.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
};
export default function RootLayout({ children, }: Readonly<{
    children: ReactNode;
}>) {
    return (<html className={`${sora.variable} ${dmSans.variable} ${dmMono.variable} ${righteous.variable}`} lang="en">
      <body className="min-h-screen overflow-x-hidden bg-wealth-bg font-sans text-wealth-primary antialiased">
        {/* Site-wide identity, so every page inherits the publisher context. */}
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatbotFloat />
        <Analytics />
      </body>
    </html>);
}
