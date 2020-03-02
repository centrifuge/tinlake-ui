import { AnyAction, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// Actions
const TRANSACTION_PROCESSING = 'tinlake-ui/transactions/TRANSCATION_PROCESSING';
const TRANSACTION_SUBMITTED = 'tinlake-ui/transactions/TRANSCATION_SUBMITTED';

// extend by potential error messages
export interface TransactionState {
  transactionState: null | 'processing' | 'submitted';
}

const initialState: TransactionState = {
    transactionState: null
};

// Reducer
export default function reducer(state: TransactionState = initialState,
                                action: AnyAction = { type: '' }): TransactionState {
  switch (action.type) {
    case TRANSACTION_PROCESSING: return { ...state, transactionState: 'processing' };
    case TRANSACTION_SUBMITTED: return { ...state, transactionState: 'submitted' };
    default: return state;
  }
}

export function transactionSubmitted():
  ThunkAction<Promise<void>, { auth: TransactionState }, undefined, Action> {
  return async (dispatch) => {
    console.log("submitted called");
    dispatch({ type: TRANSACTION_PROCESSING });
  };
}

export function responseReceived():
  ThunkAction<Promise<void>, { auth: TransactionState }, undefined, Action> {
  return async (dispatch) => {
    dispatch({ type: TRANSACTION_SUBMITTED });
  };
}