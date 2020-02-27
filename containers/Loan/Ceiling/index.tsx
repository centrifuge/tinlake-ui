import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import { baseToDisplay, displayToBase } from 'tinlake';
import NumberInput from '../../../components/NumberInput';
import { Loan, setCeiling} from '../../../services/tinlake/actions';
import { loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';

interface Props {
  loan: Loan;
  tinlake: Tinlake;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
}

interface State {
  ceiling: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class LoanCeiling extends React.Component<Props, State> {

  componentWillMount() {
    const { loan } = this.props;
    this.setState({ ceiling: (loan.principal || '0')});
  }

  setCeiling  = async () => {
    const { ceiling } = this.state;
    const { loan, tinlake } = this.props;
    this.setState({ is: 'loading' });
    const res = await setCeiling(tinlake, loan.loanId, ceiling);
    if (res && res.errorMsg) {
      this.setState({ is: 'error' });
      return;
    } 
    this.setState({ is: 'success' });
    this.props.loadLoan && this.props.loadLoan(tinlake, loan.loanId);
  }
  render() {
    const { ceiling, is } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Maximum borrow amount">
          <NumberInput value={baseToDisplay(ceiling, 18)} suffix=" DAI" precision={18} 
          onValueChange={({ value }) =>
          this.setState({ ceiling: displayToBase(value, 18)})}
          disabled={is === 'loading'}
        />
        </FormField>
      </Box>
      <Box align="start">
        <Button primary label="Set max borrow amount" onClick={this.setCeiling} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoan })(LoanCeiling);

