/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Lets parallel workers build without clobbering a shared .next cache:
  //   NEXT_DIST_DIR=.next-foo npx next build
  distDir: process.env.NEXT_DIST_DIR || '.next',
};
export default nextConfig;
