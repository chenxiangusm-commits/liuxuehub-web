import {siteUrl} from '@/lib/site-url';
export const dynamic='force-dynamic';
export function GET(){return new Response(process.env.NODE_ENV==='development'?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /favorites\nDisallow: /compare\nDisallow: /login\nDisallow: /ai/\nSitemap: '+siteUrl()+'/sitemap.xml\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
