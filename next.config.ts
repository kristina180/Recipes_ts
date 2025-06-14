import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  sassOptions: {
    additionalData: `$var: red;`,
  },
  images: {
    // domains: ["storage.googleapis.com", "coinpayments.net"],
    minimumCacheTTL: 1500000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tcdn.dummyjson.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn1.ozone.ru",
        pathname: "**",
      },
    ],
  },
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
