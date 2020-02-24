import BN from 'bn.js';
import Tinlake, { Address } from 'tinlake';

export interface NFT {
  tokenId: BN;
  nftOwner: Address;
  nftData: any;
}

export async function getNFT(tinlake: Tinlake, tokenId: string) {
  let nftOwner: Address;
  let nftData: any;
  
  try {
    nftOwner = await tinlake.getNFTOwner(tokenId);
  } catch (e) {
    return loggedError(e, 'Could not get NFT owner for NFT ID', tokenId);
  }

  if (!nftOwner) {
    return loggedError(null, 'Could not get NFT owner for NFT ID', tokenId);
  }

  try {
    nftData = await tinlake.getNFTData(tokenId);
  } catch (e) {
    // return loggedError(e, 'Could not get NFT data for NFT ID', tokenId);
    nftData = null;
  }
  const replacedTokenId = tokenId.replace(/^0x/, '');
  const bnTokenId = new BN(replacedTokenId);

  const nft: NFT = {
    nftOwner,
    nftData,
    tokenId: bnTokenId
  };

  return {
    nft,
    tokenId
  };
}

function loggedError(error: any, message: string, tokenId: string) {
  console.log(`${message} ${tokenId}`, error);
  return {
    errorMessage: `${message} ${tokenId}`,
    tokenId
  };
}
