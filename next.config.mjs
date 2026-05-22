import createNextIntlPlugin from "next-intl/plugin";

const backendApiOrigin =
  process.env.BACKEND_API_ORIGIN ??
  "https://amctag-ehkini.38f0fz.easypanel.host";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "amcserver.com"
      },
      {
        protocol: "https",
        hostname: "amctag-ehkini.38f0fz.easypanel.host"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiOrigin}/api/v2/:path*`
      }
    ];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
