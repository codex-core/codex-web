import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'codex-assets-dev.s3.us-east-1.amazonaws.com',
      'codex-images-dev.s3.us-east-1.amazonaws.com',
    ],
  },
};

export default nextConfig;
