// Shared BreadcrumbList JSON-LD emitter.
//
// Drop on any page that has a meaningful hierarchy. Google uses BreadcrumbList
// to render the Home › Section › Page rich-result trail in SERPs.
//
// Usage:
//   <BreadcrumbSchema items={[
//     { name: 'Home', url: 'https://www.canvasclasses.in' },
//     { name: 'NCERT Solutions', url: 'https://www.canvasclasses.in/ncert-solutions' },
//     { name: 'Class 12 — Solutions', url: 'https://www.canvasclasses.in/ncert-solutions/class-12/solutions' },
//   ]} />

export interface BreadcrumbItem {
    name: string;
    url: string;
}

// JSON.stringify does NOT escape <, >, &, '. If a `name` ever contains
// `</script>` we'd break out of the LD <script>. Defense-in-depth: replace
// those four chars with their \uXXXX form before injection.
function safeJsonLd(data: unknown): string {
    return JSON.stringify(data)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/'/g, '\\u0027');
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    if (items.length === 0) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
    );
}
