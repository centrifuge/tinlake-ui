import { AnyAction, Action } from 'redux';
import Tinlake, { Loan, BalanceDebt, Address, getLoanStatus, LoanStatus, bnToHex, baseToDisplay } from 'tinlake';
import BN from 'bn.js';
import { ThunkAction } from 'redux-thunk';

// Config
const startingLoanId = 0;

// Actions
const LOAD = 'tinlake-ui/loans/LOAD';
const RECEIVE = 'tinlake-ui/loans/RECEIVE';
const LOAD_SINGLE = 'tinlake-ui/loans/LOAD_SINGLE';
const LOAD_SINGLE_NOT_FOUND = 'tinlake-ui/loans/LOAD_SINGLE_NOT_FOUND';
const RECEIVE_SINGLE = 'tinlake-ui/loans/RECEIVE_SINGLE';
const RECEIVE_DEBT = 'tinlake-ui/loans/RECEIVE_DEBT';

export interface InternalListLoan extends Loan {
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
}

export interface LoansState {
  loansState: null | 'loading' | 'found';
  loans: InternalListLoan[];
  singleLoanState: null | 'loading' | 'not found' | 'found';
  singleLoan: null | InternalListLoan;
}

const initialState: LoansState = {
  loansState: null,
  loans: [],
  singleLoanState: null,
  singleLoan: null
};

// Reducer
export default function reducer(state: LoansState = initialState,
                                action: AnyAction = { type: '' }): LoansState {
  switch (action.type) {
    case LOAD: return { ...state, loansState: 'loading' };
    case RECEIVE: return { ...state, loansState: 'found', loans: action.loans };
    case LOAD_SINGLE: return { ...state, singleLoanState: 'loading', singleLoan: null };
    case LOAD_SINGLE_NOT_FOUND: return { ...state, singleLoanState: 'not found' };
    case RECEIVE_SINGLE: return { ...state, singleLoanState: 'found', singleLoan: action.loan };
    case RECEIVE_DEBT: {
      if (state.singleLoan === null) { return state; }
      return { ...state, singleLoan: { ...state.singleLoan, debt: action.debt } };
    }
    default: return state;
  }
}

export function getLoans(tinlake: Tinlake):
  ThunkAction<Promise<void>, LoansState, undefined, Action>  {
  return async (dispatch) => {
    dispatch({ type: LOAD });
    const loans = await tinlake.getLoanList();
    let loansList = [];
    // for (let i = 1; i < loans.length; i += 1) {
      // let loan = {}
      // loan.loanId = loans[i].loanId;
      // loan.registry = loans[i].registry;
      // loan.tokenId = loans[i].tokenId;
      // loan.principal = loans[i].principal;
      // loan.interestRate = loans[i].interestRate;
      // loan.ownerOf = loans[i].ownerOf;
      // loan.debt = loans[i].debt;
      // loansList.push(loan);
    // }
    console.log(loansList);
    dispatch({ type: RECEIVE, loans: loansList});
  };
}

export function getLoan(tinlake: Tinlake, loanId: string, refresh = false):
  ThunkAction<Promise<void>, LoansState, undefined, Action> {
  return async (dispatch) => {
    if (!refresh) {
      dispatch({ type: LOAD_SINGLE });
    }

    const count = await tinlake.loanCount();

    // if (count.toNumber() <= Number(loanId)) {
    //   dispatch({ type: LOAD_SINGLE_NOT_FOUND });
    // }
    //
    // const currentDebt = await tinlake.getCurrentDebt(loanId);
    //
    // const [loan, balanceDebtData] = await Promise.all([
    //   tinlake.getLoan(loanId),
    //   tinlake.getBalanceDebt(loanId)
    // ]);
    //
    // const nftOwnerPromise = tinlake.ownerOfNFT(bnToHex(loan.tokenId));
    // const loanOwnerPromise = tinlake.ownerOfLoan(loanId);
    // const appraisalPromise = tinlake.getAppraisal(loanId);
    // const nftDataPromise = tinlake.getNFTData(bnToHex(loan.tokenId));
    //
    // let nftOwner: Address;
    // let loanOwner: Address;
    // let appraisal: BN;
    // let nftData: any;
    // try {
    //   nftOwner = await nftOwnerPromise;
    // } catch (e) {
    //   console.error(`Could not get NFT owner for Loan ID ${loanId}, ` +
    //     `NFT ID ${loan.tokenId.toString()}`);
    //   nftOwner = '';
    // }
    // try {
    //   loanOwner = await loanOwnerPromise;
    // } catch (e) {
    //   console.error(`Could not get loan owner for Loan ID ${loanId}, ` +
    //     `NFT ID ${loan.tokenId.toString()}`);
    //   loanOwner = '';
    // }
    // try {
    //   appraisal = await appraisalPromise;
    // } catch (e) {
    //   console.error(`Could not get appraisal for Loan ID ${loanId}, ` +
    //     `NFT ID ${loan.tokenId.toString()}`);
    //   appraisal = new BN(0);
    // }
    // try {
    //   nftData = await nftDataPromise;
    // } catch (e) {
    //   console.error(`Could not get NFT data for Loan ID ${loanId}, ` +
    //     `NFT ID ${loan.tokenId.toString()}`);
    //   nftData = null;
    // }
    //
    // const extendedLoanData: InternalListLoan = {
    //   loanId,
    //   nftOwner,
    //   loanOwner,
    //   appraisal,
    //   nftData,
    //   principal: loan.principal,
    //   price: loan.price,
    //   fee: balanceDebtData.fee,
    //   registry: loan.registry,
    //   tokenId: loan.tokenId,
    //   balance: balanceDebtData.balance,
    //   debt: currentDebt,
    //   status: getLoanStatus(loan.principal, currentDebt)
    // };
    //
    // dispatch({ type: RECEIVE_SINGLE, loan: extendedLoanData });
  };
}

export function getDebt(tinlake: Tinlake, loanId: string):
  ThunkAction<Promise<void>, LoansState, undefined, Action> {
  return async (dispatch) => {
    const debt = await tinlake.getCurrentDebt(loanId);
    dispatch({ loanId, debt, type: RECEIVE_DEBT });
  };
}

export function subscribeDebt(tinlake: Tinlake, loanId: string):
  ThunkAction<() => void, LoansState, undefined, Action> {
  return (dispatch) => {
    dispatch(getDebt(tinlake, loanId));

    const interval = setInterval(
      () => dispatch(getDebt(tinlake, loanId)),
      1000
    );
    const discard = () => clearInterval(interval);
    return discard as any;
  };
}
