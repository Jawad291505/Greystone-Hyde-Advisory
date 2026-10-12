/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // WebP only. AVIF is about a fifth smaller, but encoding it takes
    // seconds per size, so whoever first asks for a photo at a new width
    // waited that long for it to appear.
    formats: ["image/webp"],
    // The photographs never change under the same file name
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
