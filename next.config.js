/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize for static files
    output: 'standalone',
    
    // Add compression
    compress: true,
  
    // Cache headers for models
    async headers() {
      return [
        {
          source: '/models/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        }
      ];
    }
  };
  
  module.exports = nextConfig;