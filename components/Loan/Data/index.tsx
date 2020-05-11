import * as React from 'react';
import { Box, FormField, TextInput } from 'grommet';
import { feeToInterestRate, Loan } from 'tinlake';
import NumberInput from '../../NumberInput';
import { Loan } from '../../../services/tinlake/actions';
import { Erc20Widget } from '../../Investment/TrancheMetric/erc20';
import DAI from '../../../static/dai.json';
interface Props {
  loan: Loan;
}

class LoanData extends React.Component<Props> {
  render() {
    const { loanId, debt, principal, interestRate, status } =  this.props.loan;
    return <Box>
      <Box direction="row" gap="medium" >
       <FormField label="Loan ID">
          <TextInput value={loanId} disabled />
        </FormField>
        <FormField label="Status">
          <TextInput value={status} disabled />
        </FormField>
      </Box>

      <Box direction="row" gap="medium" margin={{ bottom: 'medium', top: 'large' }}>
        <Box basis={'1/3'} gap="medium">
          <FormField label="Maximum borrow amount">
            <Erc20Widget value={principal.toString()} tokenData={DAI} precision={12} />
          </FormField>
        </Box>
        <Box basis={'1/3'} gap="medium">
          <FormField label="Debt">
            <Erc20Widget value={debt.toString()} tokenData={DAI} precision={12} />
          </FormField>
        </Box>
        <Box basis={'1/3'} gap="medium">
          <FormField label="Interest rate">
            <NumberInput value={feeToInterestRate(interestRate)} suffix="%" disabled />
          </FormField>
        </Box>
      </Box>
    </Box>;
  }
}

export default LoanData;
