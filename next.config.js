/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers:
    process.env.NODE_ENV === 'development'
      ? () => [
          {
            source: '/_next/static/css/_app-client_src_app_globals_css.css',
            headers: [{ key: 'Vary', value: '*' }],
          },
        ]
      : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['ipfs.io', "pbs.twimg.com", "api-testnet.suifrens.sui.io", "api-mainnet.suifrens.sui.io"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
