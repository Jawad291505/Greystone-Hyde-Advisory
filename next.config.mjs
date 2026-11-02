/** @type {import('next').NextConfig} */
const nextConfig = {
  // A fully static site (the enquiry form posts to FormSubmit), exported as
  // plain files for shared hosting: `npm run build` writes them to out/.
  output: "export",
  // /about is written as about/index.html, which Apache serves as-is
  trailingSlash: true,
  images: {
    // There is no server to resize photographs on request, so every width
    // below is made ahead of the build (scripts/resize-images.mjs) and the
    // loader points each srcset entry at its file.
    loader: "custom",
    loaderFile: "./app/lib/imageLoader.js",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
  },
};

export default nextConfig;
