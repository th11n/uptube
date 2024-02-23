import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({   enabled: process.env.ANALYZE === 'true', });

/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheMaxMemorySize: 0
};

export async function headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  }
export default withBundleAnalyzer(nextConfig)
