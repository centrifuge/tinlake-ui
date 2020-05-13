const { parsed: localEnv } = require('dotenv').config()

module.exports = {
  webpack(config, options) {
    // Further custom configuration here
    return {
      ...config,
      node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty'
      }
    }
  },
  publicRuntimeConfig: {
    RPC_URL: process.env.RPC_URL,
    TRANSACTION_TIMEOUT: process.env.TRANSACTION_TIMEOUT,
    ENV: process.env.ENV,
    ETHERSCAN_URL: process.env.ETHERSCAN_URL,
    POOLS: process.env.POOLS,
    TINLAKE_DATA_BACKEND_URL: process.env.TINLAKE_DATA_BACKEND_URL
  },
  experimental: {
    exportTrailingSlash: false,
  },
};
