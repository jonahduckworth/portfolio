import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/clients",
        destination: "https://clients.jdbuilds.ca",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
