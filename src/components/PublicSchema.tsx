import { siteUrl } from '@/lib/site-url';

export function PublicSchema({ entries, trail = [] }: {
  entries: Record<string, unknown>[];
  trail?: { name: string; path: string }[];
}) {
  const breadcrumbs = trail.length ? [{
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: '首页', path: '/' }, ...trail].map((entry, index) => ({
      '@type': 'ListItem', position: index + 1, name: entry.name, item: new URL(entry.path, siteUrl()).href,
    })),
  }] : [];
  const data = { '@context': 'https://schema.org', '@graph': [...entries, ...breadcrumbs] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

