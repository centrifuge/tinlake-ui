import * as React from 'react';
import Tinlake from 'tinlake';
import { LoansState, loadLoan } from '../../../ducks/loans';
import { connect } from 'react-redux';
import Alert from '../../../components/Alert';
import { Box } from 'grommet';
import LoanData from '../../../components/LoanData';
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

    console.log(loanState, loanId);
    if (loanState === null || loanState === 'loading') { return null; }
    if (loanState === 'not found') {
      return <Alert margin="medium" type="error">
        Could not find loan {loanId}</Alert>;
    }

    return <Box>
      <LoanData loan={loan!} />
      { loan && loan.nft && <NftData data={loan.nft} authedAddr={tinlake.ethConfig.from} /> }
    </Box>;

  }
}

export default connect(state => state, { loadLoan })(LoanView);
