/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React's Strict Mode for highlighting potential problems
  reactStrictMode: true,

  // Configure allowed external image domains
  images: {
    domains: [
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "lh3.googleusercontent.com", // ✅ Added for Google profile images
    ],
  },

  // Environment variables accessible in the application
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  // Rewrites to handle server-side API routing
  async rewrites() {
    return [
      {
        source: "/reset-password",
        destination: "/api/reset-password",
      },
    ];
  },
};

module.exports = nextConfig;
