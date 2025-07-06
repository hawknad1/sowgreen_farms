/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    PAYSTACK_PUBLIC_TEST_KEY: process.env.PAYSTACK_PUBLIC_TEST_KEY,
    PAYSTACK_SECRET_TEST_KEY: process.env.PAYSTACK_SECRET_TEST_KEY,
    PAYSTACK_PUBLIC_LIVE_KEY: process.env.PAYSTACK_PUBLIC_LIVE_KEY,
    PAYSTACK_SECRET_LIVE_KEY: process.env.PAYSTACK_SECRET_LIVE_KEY,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce memory usage by limiting parallel processing
    config.parallelism = 2

    // Disable source maps for production if not needed
    if (!dev) {
      config.devtool = false
    }

    return config
  },
}

export default nextConfig
