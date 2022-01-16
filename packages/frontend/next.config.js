/**
 * @type {import('next').NextConfig}
 */
const withTM = require('next-transpile-modules')(['client']); // pass the modules you would like to see transpiled

const nextConfig = withTM({
  images: {
    loader: 'default',
    domains: ['localhost'],
  },
});

module.exports = nextConfig;
