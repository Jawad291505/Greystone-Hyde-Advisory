/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF where the browser takes it (about a fifth smaller than WebP for
    // these photographs), WebP otherwise.
    formats: ["image/avif", "image/webp"],
    // The photographs never change under the same file name
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
