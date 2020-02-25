import * as React from 'react';
import { Box, FormField, TextInput } from 'grommet';
import { baseToDisplay, feeToInterestRate } from 'tinlake';
import NumberInput from '../NumberInput';
import { Loan } from '../../ducks/loans';

interface Props {
  loan: Loan;
}

class LoanData extends React.Component<Props> {
  render() {
    const { loanId, debt, principal, interestRate } =  this.props.loan;
    return <Box>
      <Box direction="row" pad={{ horizontal: 'medium' }}>
       <FormField label="Loan ID">
            <TextInput value={loanId} disabled />
        </FormField>
      </Box>

      <Box direction="row" pad={{ horizontal: 'medium' }} gap="medium" margin={{ bottom: 'medium', top: 'large' }}>
        <Box basis={'1/3'} gap="medium">
          <FormField label="Maximum Borrow Amount">
            <NumberInput value={baseToDisplay(principal, 18)} suffix=" DAI" disabled precision={18} />
          </FormField>
        </Box> 
        <Box basis={'1/3'} gap="medium">
          <FormField label="Debt">
            <NumberInput value={baseToDisplay(debt, 18)} suffix=" DAI" precision={18} disabled />
          </FormField>
        </Box>
        <Box basis={'1/3'} gap="medium">
          <FormField label="Interest Rate">
            <NumberInput value={feeToInterestRate(interestRate)} suffix="%" disabled />
          </FormField>
        </Box>
      </Box>       
    </Box>;
  }
}

export default LoanData;

