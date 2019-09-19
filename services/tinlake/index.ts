import Tinlake from 'tinlake';
import config from '../../config';
import Eth from 'ethjs';
declare var web3: any;

const { contractAddresses, nftDataDefinition, transactionTimeout, rpcUrl } = config;
const portisConfig = {
  id: '2ea2735d-4963-40f5-823f-48cab29f7319', // required
  // network: 'mainnet', // optional
  network: 'kovan', // optional
};

const walletConnectConfig = {
  // bridge: "https://bridge.walletconnect.org" // optional
};

const fortmaticConfig = {
  // key: "FORTMATIC_KEY", // required
  // network: "mainnet" // optional
};

let tinlake: Tinlake | null = null;
let authing = false;
let authed = false;

export async function getTinlake() {
  if (tinlake) { return tinlake; }
  const chosenProvider = sessionStorage.getItem('chosenProvider');
  let provider;
  let account;
  if (chosenProvider === 'injected') {
    authing = true;
    const Web3Connect = require('web3connect').default;
    provider = await Web3Connect.ConnectToInjected();
    const accounts = await provider.enable();
    account = accounts[0];

    authed = true;
    authing = false;
  }
  else {
    provider = new Eth.HttpProvider(rpcUrl);
  }
  /// web3ConnectToLast()
  // set global network
  tinlake = new Tinlake(provider, contractAddresses, nftDataDefinition.contractCall.outputs, transactionTimeout, {});
  account && tinlake!.setEthConfig({ from: account });
  return tinlake;
}

export async function authTinlake() {
  if (!tinlake) { await getTinlake(); }
  if (authing || authed) { return; }

  authing = true;

  const provider = await web3ConnectToLast();
  const accounts = await provider.enable();
  const account = accounts[0];

  tinlake!.setProvider(provider);
  tinlake!.setEthConfig({ from: account });

  authed = true;
  authing = false;
}

async function web3Connect(): Promise<any> {
  return new Promise((resolve, reject) => {
    // require here since we only want it to be loaded in browser, not on server side rendering
    const Web3Connect = require('web3connect').default;
    const web3Connect = new Web3Connect.Core({
      providerOptions: {
        portis: portisConfig,
        // fortmatic: {
        //   key: 'FORTMATIC_KEY', // required
        // },
      },
    });
    // subscibe to connect
    web3Connect.on('connect', (provider: any) => {
      const info = Web3Connect.getProviderInfo(provider);
      sessionStorage.setItem('chosenProvider', info.type === 'injected' ? 'injected' : info.name);
      resolve(provider);
    });

    // subscibe to close
    web3Connect.on('close', () => {
      reject('Web3Connect Modal Closed');
    });
    // open modal
    web3Connect.toggleModal();
  });
}

async function web3ConnectToLast(): Promise<any> {
  const chosenProvider = sessionStorage.getItem('chosenProvider');
  // if injected do not call rpc

  if (!chosenProvider) { return web3Connect(); }

  // require here since we only want it to be loaded in browser, not on server side rendering
  const Web3Connect = require('web3connect').default;

  switch (chosenProvider) {
    case 'Portis':
      return Web3Connect.ConnectToPortis(portisConfig);
    case 'WalletConnect':
      return Web3Connect.ConnectToWalletConnect(walletConnectConfig);
    case 'Fortmatic':
      return Web3Connect.ConnectToFortmatic(fortmaticConfig);
    case 'injected':
      return Web3Connect.ConnectToInjected();
    default:
      return web3Connect();
  }

}
