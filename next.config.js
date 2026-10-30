/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.LIUXUEHUB_BUILD_DIR || '.next',
  outputFileTracingIncludes: { '/*': ['./release-data/**/*.json'] },
  async rewrites() { return { beforeFiles: [
    {source:'/sitemap.xml',destination:'/api/site-map'},
    {source:'/robots.txt',destination:'/api/site-robots'},
  ] }; },
};

module.exports = nextConfig;
