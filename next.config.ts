import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'codex-web-pub-assets.s3.us-east-1.amazonaws.com'
    ],
  },
};

export default nextConfig;
