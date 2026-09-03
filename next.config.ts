import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `next build` and `next dev` share .next by default, so building while the
   * dev server is up wipes its HMR chunks and floods the console with 404s.
   * Set NEXT_BUILD_DIR=.next-verify to build into a scratch dir instead.
   */
  distDir: process.env.NEXT_BUILD_DIR || ".next",
};

export default nextConfig;
