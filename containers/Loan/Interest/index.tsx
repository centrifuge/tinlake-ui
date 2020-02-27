import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import { feeToInterestRate } from 'tinlake';
import NumberInput from '../../../components/NumberInput';
import { Loan, setInterest } from '../../../services/tinlake/actions';
import { loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';

interface Props {
  loan: Loan;
  tinlake: Tinlake;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
}

interface State {
  interestRate: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class LoanInterest extends React.Component<Props, State> {

  componentWillMount() {
    const { loan } = this.props;
    this.setState({ interestRate: feeToInterestRate(loan.interestRate)});
  }

  setInterestRate = async () => {
    const { interestRate } = this.state;
    const { loan, tinlake } = this.props;
    this.setState({ is: 'loading' });
    const res = await setInterest(tinlake, loan.loanId, loan.debt, interestRate);
    if (res && res.errorMsg) {
      this.setState({ is: 'error' });
      return;
    } 
    this.setState({ is: 'success' });
    this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
  }

  render() {
    const { interestRate, is } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Interest rate per year">
          <NumberInput value={interestRate} suffix=" %"
            onValueChange={({ value }) =>
              this.setState({ interestRate: value })}
            disabled={is === 'loading'}
          />  
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.setInterestRate} primary label="Set interest rate"  disabled={is === 'loading'} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan })(LoanInterest);