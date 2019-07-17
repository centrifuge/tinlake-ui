import * as React from 'react';
import Tinlake from 'tinlake';
import { LoansState, getLoan } from '../../ducks/loans';
import { connect } from 'react-redux';
import Alert from '../Alert';
import { Box, FormField, Button, Heading, Text } from 'grommet';
import LoanNftData from '../LoanNftData';
import { bnToHex } from '../../utils/bnToHex';
import SecondaryHeader from '../SecondaryHeader';
import Link from 'next/link';
import { LinkPrevious } from 'grommet-icons';
import { NumberInput } from '@centrifuge/axis-number-input';
import NumberDisplay from '../NumberDisplay';
import { baseToDisplay } from '../../utils/baseToDisplay';
import { displayToBase } from '../../utils/displayToBase';
import LoanData from '../LoanData';

const SUCCESS_STATUS = '0x1';

interface Props {
  loanId: string;
  tinlake: Tinlake;
  loans?: LoansState;
  getLoan?: (tinlake: Tinlake, loanId: string, refresh?: boolean) => Promise<void>;
}

interface State {
  borrowAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string;
}

class LoanBorrow extends React.Component<Props, State> {
  state: State = {
    borrowAmount: '',
    is: null,
    errorMsg: '',
  };
  lastPrincipal = '';

  componentWillMount() {
    this.props.getLoan!(this.props.tinlake, this.props.loanId);
  }

  componentDidUpdate(nextProps: Props) {
    const loans = nextProps.loans;
    if (!loans || !loans.singleLoan) { return; }
    const nextPrincipal = loans.singleLoan.principal.toString();
    if (nextPrincipal !== this.lastPrincipal) {
      this.lastPrincipal = nextPrincipal;
      this.setState({ borrowAmount: loans.singleLoan.principal.toString() });
    }
  }

  borrow = async () => {
    this.setState({ is: 'loading' });

    const { getLoan, tinlake, loanId } = this.props;
    const addresses = tinlake.contractAddresses;
    const ethFrom = tinlake.ethConfig.from;

    try {
      // get loan
      const loan = await tinlake.getLoan(loanId);

      // approve
      const res1 = await tinlake.approveNFT(bnToHex(loan.tokenId), addresses['SHELF']);

      console.log('approve results');
      console.log(res1.txHash);

      if (res1.status !== SUCCESS_STATUS || res1.events[0].event.name !== 'Approval') {
        console.log(res1);
        this.setState({ is: 'error', errorMsg: JSON.stringify(res1) });
        return;
      }

      // borrow
      const res2 = await tinlake.borrow(loanId, ethFrom);

      console.log('admit result');
      console.log(res2.txHash);

      if (res2.status !== SUCCESS_STATUS) {
        console.log(res2);
        this.setState({ is: 'error', errorMsg: JSON.stringify(res2) });
        return;
      }

      await getLoan!(tinlake, loanId, true);

      this.setState({ is: 'success' });
    } catch (e) {
      console.log(e);
      this.setState({ is: 'error', errorMsg: e.message });
    }
  }

  render() {
    const { loans, loanId, tinlake } = this.props;
    const { singleLoan, singleLoanState } = loans!;

    if (singleLoanState === null || singleLoanState === 'loading') { return 'Loading...'; }
    if (singleLoanState === 'not found') {
      return <Alert type="error">
        Could not find loan {loanId}</Alert>;
    }

    const { status, loanOwner } = singleLoan!;
    const { borrowAmount, is, errorMsg } = this.state;

    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <Link href={`/borrower/loan?loanId=${loanId}`}>
            <LinkPrevious />
          </Link>
          <Heading level="3">Borrow Loan {loanId}</Heading>
        </Box>

        {status === 'Whitelisted' && loanOwner === tinlake.ethConfig.from &&
          <Button primary onClick={this.borrow} label="Confirm"
            disabled={is === 'loading' || is === 'success'} />}
      </SecondaryHeader>

      <Box pad={{ horizontal: 'medium' }}>
        {status === 'Whitelisted' && loanOwner === tinlake.ethConfig.from &&
          <Box direction="row" justify="end" margin={{ bottom: 'medium' }}>
            <Text>
              Your Borrow Amount will be <Text weight="bold">{<NumberDisplay
                value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18} />}</Text>
            </Text>
          </Box>
        }

        {is === 'loading' && 'Borrowing...'}
        {is === 'success' && <Alert type="success" margin={{ vertical: 'large' }}>
          Successfully borrowed
          <NumberDisplay value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18} />
          for Loan ID {loanId}</Alert>}
        {is === 'error' && <Alert type="error" margin={{ vertical: 'large' }}>
          <Text weight="bold">Error borrowing for Loan ID {loanId}, see console for details</Text>
          {errorMsg && <div><br />{errorMsg}</div>}
        </Alert>}

        <Box direction="row" gap="medium" margin={{ vertical: 'medium' }}>
          <Box basis={'1/4'} gap="medium"><FormField label="Borrow Amount">
            <NumberInput
              value={baseToDisplay(borrowAmount, 18)} suffix=" DAI" precision={18}
              onChange={(masked: string, float: number) => float !== undefined &&
                this.setState({ borrowAmount: displayToBase(masked, 18) })}
              autoFocus disabled={true || is === 'loading' || is === 'success'}
            /></FormField></Box>
          <Box basis={'1/4'} gap="medium" />
          <Box basis={'1/4'} gap="medium" />
          <Box basis={'1/4'} gap="medium" />
        </Box>

        <LoanData loan={singleLoan!} />

        <LoanNftData loan={singleLoan!} authedAddr={tinlake.ethConfig.from} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { getLoan })(LoanBorrow);