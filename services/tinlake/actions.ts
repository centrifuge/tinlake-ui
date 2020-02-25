import BN from 'bn.js';
import Tinlake, { Address } from 'tinlake';
import config from '../../config';
import LoanList from '../../components/LoanList';

const { contractAddresses } = config;
const SUCCESS_STATUS = '0x1';
const nftRegistryAddress = contractAddresses['COLLATERAL_NFT'];

export interface NFT {
  tokenId: BN;
  nftOwner: Address;
  nftData: any;
}

export interface Loan {
  loanId: BN;
  registry: Address;
  tokenId: BN;
  ownerOf: BN;
  principal: BN;
  interestRate: BN;
  debt: BN;
  threshold?: BN;
  price?: BN;
  status?: string;
  nft?: NFT
}

export interface TinlakeResult {
  data?: any,
  errorMsg?: string,
  tokenId?: string,
  loanId?: string
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

export async function issue(tinlake: Tinlake, tokenId: string) {
  let result;
  try {
    result = await tinlake.issue(nftRegistryAddress, tokenId);
  } catch (e) {
    return loggedError(e, 'Could Issue loan.', tokenId)
  }

  if (result.status !== SUCCESS_STATUS) {
    return loggedError({}, 'Could Issue loan.', tokenId)
  }

  // TODO: add DSNote to issue function
  // const loanId = result.events[0].data[2].toString();
  // return {
  //     data: loanId
  // }
  const loanCount: BN = await tinlake.loanCount();
  const loanId = (loanCount.toNumber() - 1).toString()
  return {
    data: loanId
  }
}

export async function getLoan(tinlake: Tinlake, loanId: string) : Promise<Loan> {
  let loan;
  const count = await tinlake.loanCount();


  if (count.toNumber() <= Number(loanId) || Number(loanId) == 0) {
    loggedError({}, 'Loan not found', loanId);
  }
  try {
      loan = await tinlake.getLoan(loanId);
  } catch (e) {
    loggedError({}, 'Loan not found', loanId);
  }
  const nftData = await getNFT(tinlake, `${loan.tokenId}`);
  loan.nft = nftData && nftData.nft || {};
  return {
    data: loan
  }
 }

export async function getLoans(tinlake: Tinlake) : Promise<Array<Loan>> {
  const loans = await tinlake.getLoanList();
  const loansList = [];
  for (let i = 1; i < loans.length; i++) {
    loansList.push(loans[i]);
  }
  return {
    data: loansList
  }
}

function loggedError(error: any, message: string, id: string) {
  console.log(`${message} ${id}`, error);
  return {
    errorMsg: `${message} ${id}`,
    id
  };
}