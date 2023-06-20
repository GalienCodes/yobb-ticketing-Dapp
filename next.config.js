const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();

  const nextConfig = {
    reactStrictMode: true,
    // Your additional Next.js configuration options go here
  };

  return nextConfig;
};

