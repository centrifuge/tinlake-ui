import BN from 'bn.js';
import Tinlake, { Address } from 'tinlake';

export interface NFT {
  tokenId: BN;
  nftOwner: Address;
}

export async function getNFT(tinlake: Tinlake, tokenId: string) {

  let nftOwnerPromise;
  try {
    nftOwnerPromise = await tinlake.ownerOfNFT(tokenId);
  } catch (e)
  {
    return loggedError(e, 'wrong NFT ID format', tokenId);
  }

  let nftOwner: Address;

  try {
    nftOwner = await nftOwnerPromise;
  } catch (e) {
    return loggedError(e, 'Could not get NFT owner for NFT ID', tokenId);
  }

  if (!nftOwner) {
    return loggedError(null, 'Could not get NFT owner for NFT ID', tokenId);
  }

  const replacedTokenId = tokenId.replace(/^0x/, '');
  const bnTokenId = new BN(replacedTokenId);

  const nft: NFT = {
    nftOwner,
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
