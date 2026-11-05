import type { Metadata } from 'next';
import { siteUrl } from './site-url';

export function publicMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, siteUrl()).href;
  const image = { url: new URL('/share-cover.png', siteUrl()).href, width: 1200, height: 630, alt: '九万里留学库 · 全球院校与专业' };
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', siteName: '九万里留学库', locale: 'zh_CN', title, description, url, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

