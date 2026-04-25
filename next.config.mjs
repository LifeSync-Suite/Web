/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
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
