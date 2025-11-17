/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com', 'canhav.io', 'pcc.canhav.io'],
  },
  async rewrites() {
    return [
      // Handle subdomain routing for development
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'pcc.localhost:3000',
          },
        ],
        destination: '/:path*',
      },
    ]
  },
}

module.exports = nextConfig
