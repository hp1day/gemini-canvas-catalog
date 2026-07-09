import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.proxy.googlers.com", "*.googlers.com"]
};

export default nextConfig;
