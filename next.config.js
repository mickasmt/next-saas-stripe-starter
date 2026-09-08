// This CommonJS config file also uses a dynamic import() below; converting
// to full ESM would change how Next.js loads this config and isn't worth
// the risk here.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

module.exports = withContentlayer(nextConfig);
