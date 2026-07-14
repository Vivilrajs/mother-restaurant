/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.qwenlm.ai' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
    ],
  },
};

export default nextConfig;
