import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Loan, borrow } from '../../../services/tinlake/actions';
import { baseToDisplay, displayToBase } from 'tinlake';
import { loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';

interface Props {
  loan: Loan;
  tinlake: Tinlake;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
}

interface State {
  borrowAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class LoanBorrow extends React.Component<Props, State> {

  componentWillMount() {
    const { loan } = this.props;
    this.setState({ borrowAmount: (loan.principal || '0') });
  }

  borrow = async () => {
    try {
      await authTinlake();
      const { borrowAmount } = this.state;
      const { loan, tinlake } = this.props;
      this.setState({ is: 'loading' });
      const res = await borrow(tinlake, loan, borrowAmount);
      if (res && res.errorMsg) {
        this.setState({ is: 'error' });
        return;
      }
      this.setState({ is: 'success' });
      this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
    } catch (e) {
      console.log(e);
    }

  }

  render() {
    const { borrowAmount, is } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Borrow amount">
          <NumberInput value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18}
            onValueChange={({ value }) =>
              this.setState({ borrowAmount: displayToBase(value, 18) })}
            disabled={is === 'loading'}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.borrow} primary label="Borrow" disabled={is === 'loading'} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan })(LoanBorrow);