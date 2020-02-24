import * as React from 'react';
import { connect } from 'react-redux';
import WithTinlake from '../../components/WithTinlake';
import LoanIssue from '../../containers/Loans/Issue';
import { Box, Heading } from 'grommet';
import Header from '../../components/Header';
import SecondaryHeader from '../../components/SecondaryHeader';
import { menuItems } from '../../menuItems';
import { BackLink } from '../../components/BackLink';
import { LoansState, getLoan, subscribeDebt } from '../../ducks/loans';

interface Props {
  loanId: string;
  tinlake: Tinlake;
  loans?: LoansState;
  getLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
  // subscribeDebt?: (tinlake: Tinlake, loanId: string) => () => void;
}

class LoanDetail extends React.Component<Props> {
  
  componentWillMount() {
    this.props.getLoan!(this.props.tinlake, this.props.loanId);
    // this.discardDebtSubscription = this.props.subscribeDebt!(this.props.tinlake, this.props.loanId);
  }

  render() {
    const { loans, loanId, tinlake } = this.props;
    const { singleLoan, singleLoanState } = loans!;

    /*
    if (singleLoanState === null || singleLoanState === 'loading') { return null; }
    if (singleLoanState === 'not found') {
      return 
      // issue loan
    }
    */

    return <Box>
      <Header
        selectedRoute={'/loans/detail'}
        menuItems={menuItems}
      />
      <Box align="start">
        <SecondaryHeader>
          <Box direction="row" gap="small" align="center">
            <BackLink href={'/loans'} />
            <Heading level="3">Loan</Heading>
          </Box>
        </SecondaryHeader>
      </Box>

      <Box justify="center" direction="row">
        <Box width="xlarge" >
            <WithTinlake render={tinlake =>
              <LoanIssue tinlake={tinlake} mode="loans" />
            } />
        </Box>
      </Box>
    </Box>;
  }
}

export default connect(state => state, { getLoan, subscribeDebt })(LoanDetail);
