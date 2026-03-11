/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    serverExternalPackages: ['better-sqlite3'],
    async redirects() {
      return [
        {
          source: '/',
          destination: '/riders',
          permanent: true,
        },
      ]
    },
  }
