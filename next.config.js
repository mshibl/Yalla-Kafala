const withNextIntl = require("next-intl/plugin")();
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
      },
    ],
  },
  serverExternalPackages: ["pdf-parse"],
  async redirects() {
    return [
      {
        source: "/donate-en",
        destination: "/ar/donate",
        permanent: true,
      },
      {
        source: "/donate-ar",
        destination: "/ar/donate",
        permanent: true,
      },
      {
        source: "/faqs",
        destination: "/ar/faqs",
        permanent: true,
      },
      {
        source: "/kafala-stories",
        destination: "/ar/kafala_stories",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
