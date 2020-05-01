import { AnyAction, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Tinlake, getLoans, getLoan, TinlakeResult, Loan } from '../services/tinlake/actions';
import Apollo from '../services/apollo';

// Actions
const LOAD = 'tinlake-ui/loans/LOAD';
const RECEIVE = 'tinlake-ui/loans/RECEIVE';
const LOAD_LOAN = 'tinlake-ui/loans/LOAD_LOAN';
const LOAN_NOT_FOUND = 'tinlake-ui/loans/LOAN_NOT_FOUND';
const RECEIVE_LOAN = 'tinlake-ui/loans/RECEIVE_LOAN';

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
    default: return state;
  }
}

// hardcoded root just for testing - will be removed in next pr
export function loadLoans(tinlake: Tinlake):
  ThunkAction<Promise<void>, LoansState, undefined, Action>  {
  return async (dispatch) => {
    dispatch({ type: LOAD });
    const root = tinlake.contractAddresses["ROOT_CONTRACT"];
    console.log("root", root);
    const result = await Apollo.getLoans(tinlake.contractAddresses["ROOT_CONTRACT"]);
    const loans = result.data;
   
    dispatch({ type: RECEIVE, loans });
  };
}

export function loadLoan(tinlake: any, loanId: string, refresh = false):
  ThunkAction<Promise<void>, LoansState, undefined, Action> {
  return async (dispatch) => {
    if (!refresh) {
      dispatch({ type: LOAD_LOAN });
    }
    const result : TinlakeResult  = await getLoan(tinlake, loanId);
    if (result.errorMsg || !result.data) {
      dispatch({ type: LOAN_NOT_FOUND });
      return;
    }
    dispatch({ type: RECEIVE_LOAN, loan: result.data });

  };
}
