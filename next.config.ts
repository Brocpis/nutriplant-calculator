// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   trailingSlash: true,
//   images: {
//     unoptimized: true
//   }
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
  redirects: async () => []
}

module.exports = nextConfig
