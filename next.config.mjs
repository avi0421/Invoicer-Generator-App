/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Invoice-Generator-App' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/Invoice-Generator-App' : '',
};

export default nextConfig;