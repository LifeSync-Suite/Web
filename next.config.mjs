/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  eslint: {
    // Skip ESLint during `next build`. Lint manually with `npm run lint`.
    ignoreDuringBuilds: true
  },
  redirects: async () => {
    return [
      // /app → dashboard entry point
      {
        source: '/app',
        destination: '/en/dashboards/crm',
        permanent: false,
        locale: false
      },
      {
        source: '/:lang(en|fr|ar)/app',
        destination: '/:lang/dashboards/crm',
        permanent: false,
        locale: false
      },
      // / → /en (landing page)
      {
        source: '/',
        destination: '/en',
        permanent: false,
        locale: false
      },
      // Non-localised paths get prefixed with /en
      {
        source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/en/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
