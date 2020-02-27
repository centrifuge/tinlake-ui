import * as React from 'react';
import Tinlake from 'tinlake';
import Link from 'next/link';
import { Box } from 'grommet';
import { connect } from 'react-redux';
import { Loan, LoansState, loadLoans } from '../../../ducks/loans';
import { Spinner } from '@centrifuge/axis-spinner';
import { AuthState } from '../../../ducks/auth';
import LoanListData from '../../../components/Loan/List';

interface Props {
  tinlake: Tinlake;
  loans?: LoansState;
  loadLoans?: (tinlake: Tinlake) => Promise<void>;
  auth: AuthState
}

class LoanList extends React.Component<Props> {
  componentWillMount() {
    this.props.loadLoans(this.props.tinlake);
  }

  render() {
    const { loans, auth, tinlake: { ethConfig: { from: ethFrom } } } = this.props;
    if (loans!.loansState === 'loading') {
      return <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading...'} />;
    }

    let filteredLoans: Array<Loan> = [];
    const hasAdminPermissions = auth.user && ( auth.user.permissions.canSetInterestRate || auth.user.permissions.canSetCeiling);
    if (loans!.loansState === 'found' && auth.user) {
      filteredLoans = hasAdminPermissions ? loans!.loans : loans!.loans.filter(l => l.ownerOf === auth.user.address);
    }

    return <Box>
      <LoanListData loans={filteredLoans} userAddress={ethFrom}> </LoanListData>
    </Box>
  }
}
export default connect(state => state, { loadLoans })(LoanList);
