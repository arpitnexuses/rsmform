/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-nexlink.s3.us-east-2.amazonaws.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['framer-motion'],
}

module.exports = nextConfig
