const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  typescript: {
    // Temporarily ignore TypeScript errors during development
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during development
    ignoreDuringBuilds: true,
  },
}