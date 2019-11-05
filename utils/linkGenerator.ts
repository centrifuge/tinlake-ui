
const rootLink = `https://[[network]]etherscan.io`;
import BN from 'bn.js';

export const getAddressLink = (network: string, address: string) => {
    return `${rootLink.replace('[[network]]', network)}/address/${address}`;
  };
  
  export const getNFTLink = (network: string, tokenId: string, registyAddress: string) => {
    console.log(network, tokenId, registyAddress )
    const tokenToInt = hexToInt(tokenId);
    return `${rootLink.replace('[[network]]', network)}/token/${registyAddress}?a=${tokenToInt}`;
  };
  
  export const hexToInt = (hex: string) => {
    return new BN(hex.replace(/^0x/, ''), 16).toString();
  };
  