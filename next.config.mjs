/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  images: {
    qualities: [75, 100, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evxvtcfkwbjaqiazokhb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '*/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
    browserToTerminal: true,
  },
  // output: 'export'
};

export default nextConfig;
