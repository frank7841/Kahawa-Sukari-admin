/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "https://kahawa-sukari-next.s3.ap-south-1.amazonaws.com",
      "kahawa-sukari.s3.amazonaws.com",
      "lh3.googleusercontent.com",
      "https://static.vecteezy.com",
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
