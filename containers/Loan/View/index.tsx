import * as React from 'react';
import Tinlake from 'tinlake';
import { LoansState, loadLoan } from '../../../ducks/loans';
import { Box, Heading } from 'grommet';
import { connect } from 'react-redux';
import Alert from '../../../components/Alert';
import LoanData from '../../../components/Loan/Data';
import LoanCeiling from '../Ceiling';
import LoanInterest from '../Interest';
import LoanBorrow from '../Borrow';
import LoanRepay from '../Repay';
import NftData from '../../../components/NftData';
import { AuthState } from '../../../ducks/auth';


interface Props {
  tinlake: Tinlake;
  loanId?: string;
  loans?: LoansState;
  loadLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
  auth: AuthState;
}

// on state change tokenId --> load nft data for loan collateral
class LoanView extends React.Component<Props> {

  componentWillMount() {
    this.props.loanId && this.props.loadLoan!(this.props.tinlake, this.props.loanId);
  }

  render() {
    const { loans, loanId, tinlake, auth } = this.props;
    const { loan, loanState } = loans!;

    if (loanState === null || loanState === 'loading') { return null; }
    if (loanState === 'not found') {
      return <Alert margin="medium" type="error">
        Could not find loan {loanId}</Alert>;
    }

    const hasAdminPermissions = auth.user && (auth.user.permissions.canSetInterestRate || auth.user.permissions.canSetCeiling);
    const hasBorrowerPermissions = auth.user && loan && (loan.ownerOf === auth.user.address);

    return <Box>
      <LoanData loan={loan!} />
      {loan && loan.status !== 'closed' &&
        <Box>
          {hasAdminPermissions &&
            <Box pad={{ horizontal: 'medium' }} margin={{ top: "large", bottom: "large" }} >
              <Box gap="medium" align="start" margin={{ bottom: "medium" }} >
                <Heading level="5" margin="none">Loan Settings</Heading>
              </Box>
              <Box direction="row">
                {auth.user && auth.user.permissions.canSetInterestRate &&
                  <LoanInterest loan={loan!} tinlake={tinlake}> </LoanInterest>
                }
                {auth.user && auth.user.permissions.canSetCeiling &&
                  <LoanCeiling loan={loan!} tinlake={tinlake}> </LoanCeiling>
                }
              </Box>
            </Box>
          }

          {hasBorrowerPermissions &&
            <Box pad={{ horizontal: 'medium' }} margin={{ top: "large", bottom: "large" }} >
              <Box gap="medium" align="start" margin={{ bottom: "medium" }} >
                <Heading level="5" margin="none">Borrow / Repay </Heading>
              </Box>
              <Box direction="row">
                <LoanBorrow loan={loan!} tinlake={tinlake}> </LoanBorrow>
                <LoanRepay loan={loan!} tinlake={tinlake}> </LoanRepay>
              </Box>
            </Box>
          }
        </Box>
      }
      {loan && loan.nft && <NftData data={loan.nft} authedAddr={tinlake.ethConfig.from} />}
    </Box>
  }
}

export default connect(state => state, { loadLoan })(LoanView);
