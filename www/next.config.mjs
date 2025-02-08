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
      {
        source: '/blog/2025/01/16/mastermind-the-ics4u-culminating-project',
        destination: '/blog/17d5f284f8a480988a9ad20e5fd4fa57',
        permanent: true,
      },
      {
        source: '/blog/2024/11/09/configuring-powersagitar-powerium-io',
        destination: '/blog/13a5f284f8a4801b946bdaf8c44c59a2',
        permanent: true,
      },
      {
        source:
          '/blog/2024/02/01/decoding-conditionals-a-dive-into-if-else-switch-case-lookup-tables-and-interfaces',
        destination: '/blog/1165f284f8a480a8b9c7c84f9c76ba69',
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
