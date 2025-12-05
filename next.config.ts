import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "historyclub.sk" },
      { protocol: "https", hostname: "www.historyclub.sk" },
        { protocol: "https", hostname: "media.historyclub.sk" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
