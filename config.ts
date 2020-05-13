import getConfig from 'next/config';
import { networkUrlToName } from './utils/networkNameResolver';
const { publicRuntimeConfig } = getConfig();

const config = {
  rpcUrl: publicRuntimeConfig.RPC_URL,
  etherscanUrl: publicRuntimeConfig.ETHERSCAN_URL,
  transactionTimeout: publicRuntimeConfig.TRANSACTION_TIMEOUT,
  isDemo: publicRuntimeConfig.ENV && (publicRuntimeConfig.ENV === 'demo'),
  network: publicRuntimeConfig.RPC_URL && networkUrlToName(publicRuntimeConfig.RPC_URL),
  tinlakeDataBackendUrl:  publicRuntimeConfig.TINLAKE_DATA_BACKEND_URL,
  // TODO: make this into publicRuntimeConfig
  gasLimit: 1000000000000000000,
  pools: publicRuntimeConfig.POOLS && JSON.parse(publicRuntimeConfig.POOLS) as Array<Pool>
};

export type Pool = {
  addresses: {
    "ROOT_CONTRACT": string, 
    "ACTIONS": string,
    "PROXY_REGISTRY": string,
    "COLLATERAL_NFT": string
  },
  graph: string, 
  contractConfig: {
    "JUNIOR_OPERATOR": "ALLOWANCE_OPERATOR" | "PROPORTIONAL_OPERATOR",
    "SENIOR_OPERATOR": "ALLOWANCE_OPERATOR" | "PROPORTIONAL_OPERATOR"
  }
  name: string
  description: string
  slug: string
  asset: string
}

export default config;
