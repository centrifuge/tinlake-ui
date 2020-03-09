import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Loan, borrow } from '../../../services/tinlake/actions';
import { baseToDisplay, displayToBase } from 'tinlake';
import { transactionSubmitted, responseReceived } from '../../../ducks/transactions';
import { loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';

interface Props {
  loan: Loan;
  tinlake: Tinlake;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
  transactionSubmitted?: (loadingMessage: string) => Promise<void>;
  responseReceived?: (successMessage: string | null, errorMessage: string | null) => Promise<void>;
}

interface State {
  borrowAmount: string;
}

class LoanBorrow extends React.Component<Props, State> {

  componentWillMount() {
    const { loan } = this.props;
    this.setState({ borrowAmount: (loan.principal || '0') });
  }

  borrow = async () => {
    this.props.transactionSubmitted && this.props.transactionSubmitted("Borrowing initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.");
    try {
      await authTinlake();
      const { borrowAmount } = this.state;
      const { loan, tinlake } = this.props;
      const res = await borrow(tinlake, loan, borrowAmount);
      if (res && res.errorMsg) {
        this.props.responseReceived && this.props.responseReceived(null, `Borrowing failed. ${res.errorMsg}`);
        return;
      }
      this.props.responseReceived && this.props.responseReceived(`Borrowing successful. Please check your wallet.`, null);
      this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
    } catch (e) {
      this.props.responseReceived && this.props.responseReceived(null, `Borrowing failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { borrowAmount } = this.state;
    const { loan } = this.props;
    const ceilingSet = loan.principal.toString() !== '0';
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Borrow amount">
          <NumberInput value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18}
            onValueChange={({ value }) =>
              this.setState({ borrowAmount: displayToBase(value, 18) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.borrow} primary label="Borrow" disabled={ !ceilingSet } />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan, transactionSubmitted, responseReceived })(LoanBorrow);