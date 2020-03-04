import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Loan, repay } from '../../../services/tinlake/actions';
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
  repayAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class LoanRepay extends React.Component<Props, State> {

  componentWillMount() {
    const { loan } = this.props;
    this.setState({ repayAmount: ( loan.debt || '0') });
  }

  repay = async () => {
    try {
        await authTinlake();
        const { repayAmount } = this.state;
        const { loan, tinlake } = this.props;
        this.setState({ is: 'loading' });
        // support partial repay later
        const res = await repay(tinlake, loan);
        if (res && res.errorMs) {
            this.setState({ is: 'error' });
            return;
        } 
        this.setState({ is: 'success' });
        this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
    } catch(e) {
        console.log(e);
    }
  }

  render() {
    const { repayAmount, is } = this.state;
    const { loan } = this.props;
    const hasDebt = loan.debt.toString() !== '0';

    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Repay amount">
          <NumberInput value={ baseToDisplay(repayAmount, 18)} suffix=" DAI" precision={18} 
            onValueChange={({ value }) =>
              this.setState({ repayAmount: displayToBase(value) })}
            disabled
          />  
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.repay} primary label="Repay"  disabled={is === 'loading' || !hasDebt} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan })(LoanRepay);