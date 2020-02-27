import * as React from 'react';
import Tinlake, { bnToHex, baseToDisplay, feeToInterestRate } from 'tinlake';
import Link from 'next/link';
import { Box, DataTable, Anchor, Text } from 'grommet';
import { connect } from 'react-redux';
import { Loan, LoansState, loadLoans } from '../../../ducks/loans';
import NumberDisplay from '../../../components/NumberDisplay';
import Badge from '../../../components/Badge';
import { Spinner } from '@centrifuge/axis-spinner';
import { DisplayField } from '@centrifuge/axis-display-field';
import { getNFTLink, hexToInt } from '../../../utils/etherscanLinkGenerator';

interface Props {
  tinlake: Tinlake;
  loans?: LoansState;
  loadLoans?: (tinlake: Tinlake) => Promise<void>;
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

    let filteredLoans: Loan[];
    if (loans!.loansState === 'found' && auth.state === 'loaded') {
      filteredLoans = auth.user && (auth.user.permissions.canSetInterestRate || auth.user.permissions.canSetCeiling) ? loans!.loans : loans!.loans.filter(l => l.ownerOf === ethFrom);
    }

    return <Box pad={{horizontal: "large"}}>
      <DataTable style={{ tableLayout: 'auto' }} data={filteredLoans} sortable columns={[
        { header: <HeaderCell text={'Loan ID'}></HeaderCell>, property: 'loanId', align: 'end' },
        {
          header: 'NFT ID', property: 'tokenId', align: 'end',
          render: (l: Loan) =>
            <Box style={{ maxWidth: '150px' }}>
              <DisplayField
                as={'span'}
                value={hexToInt(bnToHex(l.tokenId).toString())}
                link={{
                  href: getNFTLink(hexToInt(bnToHex(l.tokenId).toString()), l.registry),
                  target: '_blank'
                }}
              />
            </Box>
        },
        {
          header: 'LoanOwner', property: 'loanOwner', align: 'end',
          render: (l: Loan) => <div>
            <Box style={{ maxWidth: '150px' }}>
              <DisplayField
                copy={true}
                as={'span'}
                value={l.ownerOf}
              />
            </Box>

          </div>
        },
        {
          header: '', property: '', align: 'end',
          render: (l: Loan) => <div>
            {l.nftOwner === ethFrom && <Badge text={'Me'} />}
          </div>
        },
        {
          header: 'Max borrow amount (DAI)', property: 'principal', align: 'end',
          render: (l: Loan) =>
            <NumberDisplay suffix="" precision={4}
              value={baseToDisplay(l.principal, 18)} />
        },
        {
          header: <HeaderCell text={'Interest Rate'}></HeaderCell>, property: 'fee', align: 'end',
          render: (l: Loan) => l.status === 'Repaid' ? '-' :
            <NumberDisplay suffix="%" value={feeToInterestRate(l.interestRate)} />
        },
        {
          header: 'Debt (DAI)', property: 'debt', align: 'end',
          render: (l: Loan) => l.status === 'Whitelisted' ? '-' :
            <NumberDisplay suffix="" precision={4} value={baseToDisplay(l.debt, 18)} />
        },
        {
          header: 'Actions', property: 'id', align: 'end', sortable: false,
          render: (l: Loan) => {
            return <Link href={`/loans/loan?loanId=${l.loanId}`}><Anchor>View</Anchor></Link>;
          }
        }
      ]} />
    </Box>;
  }
}

const HeaderCell = (props: { text: string }) => (
  <Box pad={{ left: 'small' }}><Text>{props.text}</Text></Box>
);

export default connect(state => state, { loadLoans })(LoanList);
