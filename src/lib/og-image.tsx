import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Shared renderer for every page's social card. Each route exports a tiny
// opengraph-image.tsx that calls this, so the branding is defined once and the
// cards stay consistent wherever a link is pasted.
//
// Cards are 1200x630 — the size Open Graph and X both crop to. The previous
// static poster.png was 1027x437, so every shared link was being letterboxed
// and upscaled.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Straight from the brand tokens in styles/globals.css, so the card matches the
// site rather than approximating it.
const CREAM = "#FFFDF4";       // --wealth-bg, the off-white-orange surface
const INK = "#0f1a2c";         // --wealth-text-primary
const INK_SOFT = "#495973";    // --wealth-text-secondary
const ORANGE = "#fe9800";      // --wealth-accent

// Read once per process; the images are generated at build time.
let logoDataUri: string | null = null;
async function loadLogo(): Promise<string> {
    if (!logoDataUri) {
        const bytes = await readFile(join(process.cwd(), "public", "logo.png"));
        logoDataUri = `data:image/png;base64,${bytes.toString("base64")}`;
    }
    return logoDataUri;
}

// Sora is the site's own display font, vendored here rather than fetched from
// Google at build time so image generation has no network dependency. Satori
// ignores fontWeight unless it is given a face for that weight, so both the
// regular and bold files are loaded.
let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] | null = null;
async function loadFonts() {
    if (!fonts) {
        const [regular, bold] = await Promise.all([
            readFile(join(process.cwd(), "src/assets/fonts/Sora-400.ttf")),
            readFile(join(process.cwd(), "src/assets/fonts/Sora-700.ttf")),
        ]);
        fonts = [
            { name: "Sora", data: regular.buffer.slice(regular.byteOffset, regular.byteOffset + regular.byteLength) as ArrayBuffer, weight: 400, style: "normal" },
            { name: "Sora", data: bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength) as ArrayBuffer, weight: 700, style: "normal" },
        ];
    }
    return fonts;
}

// Long titles shrink rather than overflow the card.
function titleFontSize(title: string): number {
    if (title.length <= 28) return 76;
    if (title.length <= 48) return 62;
    if (title.length <= 70) return 52;
    return 44;
}

interface OgCard {
    /** Small uppercase label above the title, e.g. "Financial Calculator". */
    eyebrow: string;
    title: string;
    subtitle?: string;
}

export async function renderOgImage({ eyebrow, title, subtitle }: OgCard) {
    const [logo, fontFaces] = await Promise.all([loadLogo(), loadFonts()]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // Flat fill, no gradient: the card should read as one clean
                    // brand surface at thumbnail size.
                    backgroundColor: CREAM,
                    // Feeds render previews on white, where a cream card would have
                    // no visible edge. A hairline keeps the card's shape.
                    border: "2px solid #F2E7CE",
                    padding: "62px 70px",
                    fontFamily: "Sora",
                }}
            >
                {/* Brand lockup */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={logo}
                        width={84}
                        height={84}
                        alt=""
                        // The logo art is already cream-backed, so on a cream card
                        // the tile needs an edge or it dissolves into the surface.
                        style={{ borderRadius: 22, border: `2px solid ${ORANGE}` }}
                    />
                    <span style={{ marginLeft: 22, fontSize: 38, fontWeight: 700, color: INK, letterSpacing: -0.5 }}>
                        {SITE_NAME}
                    </span>
                </div>

                {/* Message */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: ORANGE, letterSpacing: 3, textTransform: "uppercase" }}>
                        {eyebrow}
                    </span>
                    <span
                        style={{
                            marginTop: 18,
                            fontSize: titleFontSize(title),
                            fontWeight: 700,
                            color: INK,
                            lineHeight: 1.12,
                            letterSpacing: -1.5,
                        }}
                    >
                        {title}
                    </span>
                    {subtitle ? (
                        <span style={{ marginTop: 20, fontSize: 27, color: INK_SOFT, lineHeight: 1.38 }}>
                            {subtitle}
                        </span>
                    ) : null}
                </div>

                {/* Footer: domain, and the banded rule the print template uses. */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", height: 8, width: "100%" }}>
                        {["#8C5400", "#C57600", ORANGE, "#FFBA54", "#FFDDAA"].map((band) => (
                            <div key={band} style={{ flex: 1, backgroundColor: band }} />
                        ))}
                    </div>
                    {/* --wealth-text-muted only reaches 2.8:1 on this cream, so the
                        domain uses the secondary ink instead. */}
                    <span style={{ marginTop: 20, fontSize: 24, fontWeight: 400, color: INK_SOFT }}>
                        {SITE_URL.replace(/^https?:\/\//, "")}
                    </span>
                </div>
            </div>
        ),
        { ...OG_SIZE, fonts: fontFaces },
    );
}
