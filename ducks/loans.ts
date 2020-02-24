import { AnyAction, Action } from 'redux';
import Tinlake, { Loan, Address } from 'tinlake';
import BN from 'bn.js';
import { ThunkAction } from 'redux-thunk';
import { NFT, getNFT } from '../services/nft'

// Actions
const LOAD = 'tinlake-ui/loans/LOAD';
const RECEIVE = 'tinlake-ui/loans/RECEIVE';
const LOAD_LOAN = 'tinlake-ui/loans/LOAD_LOAN';
const LOAN_NOT_FOUND = 'tinlake-ui/loans/LOAN_NOT_FOUND';
const RECEIVE_LOAN = 'tinlake-ui/loans/RECEIVE_LOAN';
const RECEIVE_DEBT = 'tinlake-ui/loans/RECEIVE_DEBT';

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

export interface LoansState {
  loansState: null | 'loading' | 'found';
  loans: Loan[];
  loanState: null | 'loading' | 'not found' | 'found';
  loan: null | Loan;
}

const initialState: LoansState = {
  loansState: null,
  loans: [],
  loanState: null,
  loan: null
};

// Reducer
export default function reducer(state: LoansState = initialState,
                                action: AnyAction = { type: '' }): LoansState {
  switch (action.type) {
    case LOAD: return { ...state, loansState: 'loading' };
    case RECEIVE: return { ...state, loansState: 'found', loans: action.loans };
    case LOAD_LOAN: return { ...state, loanState: 'loading', loan: null };
    case LOAN_NOT_FOUND: return { ...state, loanState: 'not found' };
    case RECEIVE_LOAN: return { ...state, loanState: 'found', loan: action.loan };
    case RECEIVE_DEBT: {
      if (state.loan === null) { return state; }
      return { ...state, loan: { ...state.loan, debt: action.debt } };
    }
    default: return state;
  }
}

export function getLoans(tinlake: Tinlake):
  ThunkAction<Promise<void>, LoansState, undefined, Action>  {
  return async (dispatch) => {
    dispatch({ type: LOAD });
    const loans = await tinlake.getLoanList();
    const loansList = [];
    for (let i = 1; i < loans.length; i++) {
     loansList.push(loans[i]);
    }
    dispatch({ type: RECEIVE, loans: loansList});
  };
}

export function getLoan(tinlake: Tinlake, loanId: string, refresh = false):
  ThunkAction<Promise<void>, LoansState, undefined, Action> {
  return async (dispatch) => {
    if (!refresh) {
      dispatch({ type: LOAD_LOAN });
    }

    let loan;
    const count = await tinlake.loanCount();
    if (count.toNumber() <= Number(loanId) || Number(loanId) == 0) {
      dispatch({ type: LOAN_NOT_FOUND });
    }

    try {
        loan = await tinlake.getLoan(loanId);
    } catch (e) {
        console.error(`Could not get loan for Loan ID ${loanId}`);
    }
    const nftData = await getNFT(tinlake, `${loan.tokenId}`);
    loan.nft = nftData && nftData.nft || {};
    dispatch({ type: RECEIVE_LOAN, loan});
    
  };
}

export function getDebt(tinlake: Tinlake, loanId: string):
  ThunkAction<Promise<void>, LoansState, undefined, Action> {
  return async (dispatch) => {
    const debt = await tinlake.getCurrentDebt(loanId);
    dispatch({ loanId, debt, type: RECEIVE_DEBT });
  };
}