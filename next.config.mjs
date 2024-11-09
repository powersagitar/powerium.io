/** @type {import('next').NextConfig} */
const nextConfig = {
  // temporary redirects
  async redirects() {
    return [
      {
        source:
          '/decoding-conditionals-a-dive-into-if-else-switch-case-lookup-tables-and-interfaces',
        destination:
          '/blog/2024/02/01/decoding-conditionals-a-dive-into-if-else-switch-case-lookup-tables-and-interfaces',
        permanent: true,
      },
      {
        source: '/connections',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
