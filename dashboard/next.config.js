/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable features that don't work with static export
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;