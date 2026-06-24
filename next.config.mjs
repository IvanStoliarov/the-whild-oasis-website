/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evxvtcfkwbjaqiazokhb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
    ],
  },
  // output: 'export'
};

export default nextConfig;
