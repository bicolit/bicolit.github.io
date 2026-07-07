/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages. Content is read from the filesystem at
  // build time via the Keystatic reader (src/lib/content.ts), so no server is
  // needed at runtime. The Keystatic admin (/keystatic, /api/keystatic) is a
  // dev-only, local-filesystem editor and is stripped from the Pages build.
  output: "export",
  images: {
    // GitHub Pages has no image optimizer; serve sources as-is.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bicolit.org",
      },
    ],
  },
};

export default nextConfig;
