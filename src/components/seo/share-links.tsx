"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

// Share controls for pages that are worth passing on — the calculators in
// particular, which people send to a friend or a client. The blog article page
// has its own equivalent inline.
//
// The URL is read from the browser rather than rebuilt from the site config, so
// a link shared from staging points at staging.

interface ShareLinksProps {
    /** Used as the tweet/message text. */
    title: string;
    label?: string;
}

export function ShareLinks({ title, label = "Share this calculator" }: ShareLinksProps) {
    const [copied, setCopied] = useState(false);

    const open = (build: (url: string, text: string) => string) => {
        if (typeof window === "undefined") return;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(title);
        window.open(build(url, text), "_blank", "noopener,width=600,height=450");
    };

    const copy = async () => {
        if (typeof window === "undefined") return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
        catch {
            // Clipboard access can be refused (insecure origin, denied permission).
            setCopied(false);
        }
    };

    const targets = [
        { key: "x", label: "Share on X", icon: FaXTwitter, build: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
        { key: "whatsapp", label: "Share on WhatsApp", icon: FaWhatsapp, build: (u: string, t: string) => `https://api.whatsapp.com/send?text=${t}%20${u}` },
        { key: "linkedin", label: "Share on LinkedIn", icon: FaLinkedinIn, build: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { key: "facebook", label: "Share on Facebook", icon: FaFacebookF, build: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-gray-500">{label}</span>
            {targets.map((target) => (
                <button
                    key={target.key}
                    type="button"
                    onClick={() => open(target.build)}
                    aria-label={target.label}
                    title={target.label}
                    className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a2332] transition-colors hover:border-[#fe9800] hover:text-[#fe9800]"
                >
                    <target.icon className="size-4" />
                </button>
            ))}
            <button
                type="button"
                onClick={copy}
                aria-label="Copy link"
                title="Copy link"
                className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1a2332] transition-colors hover:border-[#fe9800] hover:text-[#fe9800]"
            >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Link2 className="size-4" />}
                {copied ? "Copied" : "Copy link"}
            </button>
        </div>
    );
}
