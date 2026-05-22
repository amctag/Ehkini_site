import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // EasyPanel preview / dev over public URL (webpack HMR)
  allowedDevOrigins: [
    "amctag-website-ehkini.38f0fz.easypanel.host",
    "*.38f0fz.easypanel.host"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "amcserver.com"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://amcserver.com/app/taaruf/public/api/v2/:path*"
      }
    ];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
