import * as React from 'react';
import Tinlake from 'tinlake';
import { LoansState, loadLoan } from '../../../ducks/loans';
import { Box, FormField, TextInput, Button, Heading, Text } from 'grommet';
import { connect } from 'react-redux';
import Alert from '../../../components/Alert';
import LoanData from '../../../components/Loan/Data';
import LoanCeiling from '../Ceiling';
import LoanInterest from '../Interest';
import NftData from '../../../components/NftData';


interface Props {
  tinlake: Tinlake;
  loanId?: string;
  loans?: LoansState;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
}

// on state change tokenId --> load nft data for loan collateral
class LoanView extends React.Component<Props> {
  
  componentWillMount() {
    this.props.loanId && this.props.loadLoan!(this.props.tinlake, this.props.loanId);
  }

  render() {
    const { loans, loanId, tinlake } = this.props;
    const { loan, loanState } = loans!;
    
    if (loanState === null || loanState === 'loading') { return null; }
    if (loanState === 'not found') {
      return <Alert margin="medium" type="error">
        Could not find loan {loanId}</Alert>;
    }

    return <Box>
      <LoanData loan={loan!} />

      {/* borrower section */}
      {/* admin section */}
      <Box pad={{ horizontal: 'medium' }} margin={{ top: "large", bottom: "large" }} >
        <Box gap="medium" align="start"  margin={{ bottom: "medium" }} >
          <Heading level="5" margin="none">Loan Settings</Heading>
        </Box>
        <Box direction="row">
          {/* interest permissions */}   
          <LoanInterest loan={loan!} tinlake={tinlake}> </LoanInterest>
          {/* ceiling permissions */}
          <LoanCeiling loan={loan!} tinlake={tinlake}> </LoanCeiling>

        </Box>
      </Box>


      {/* // set max borrow amount
      // set rate
      // borrow repay */}
      { loan && loan.nft && <NftData data={loan.nft} authedAddr={tinlake.ethConfig.from} /> }
     
    </Box>

  }
}

export default connect(state => state, { loadLoan })(LoanView);
