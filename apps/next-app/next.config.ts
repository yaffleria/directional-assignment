import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fe-hiring-rest-api.vercel.app/:path*'
      }
    ]
  }
}

export default nextConfig
