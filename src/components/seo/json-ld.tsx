// Structured data for crawlers. Rendered as a script tag rather than through
// next/script so it is present in the initial HTML, which is what Google's
// rich-result parser reads.
export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}
