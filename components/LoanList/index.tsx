import * as React from 'react';
import Tinlake, { bnToHex, baseToDisplay, feeToInterestRate } from 'tinlake';
import Link from 'next/link';
import { Box, DataTable, Anchor, Text, Button } from 'grommet';
import { connect } from 'react-redux';
import { InternalListLoan, LoansState, getLoans } from '../../ducks/loans';
import NumberDisplay from '../NumberDisplay';
import Badge from '../Badge';
import { Spinner } from '@centrifuge/axis-spinner';
import { DisplayField } from '@centrifuge/axis-display-field';
import { getNFTLink, getAddressLink, hexToInt } from '../../utils/etherscanLinkGenerator';

interface Props {
  tinlake: Tinlake;
  loans?: LoansState;
  getLoans?: (tinlake: Tinlake) => Promise<void>;
}

class LoanList extends React.Component<Props> {
  componentWillMount() {
    this.props.getLoans(this.props.tinlake);
  }

  render() {
    const { loans, auth, tinlake: { ethConfig: { from: ethFrom } } } = this.props;
    if (loans!.loansState === 'loading') {
      return <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading...'} />;
    }

    let filteredLoans: InternalListLoan[];
    if (loans!.loansState === 'found' && auth.state === 'loaded') {
      filteredLoans =  loans!.loans

      // filteredLoans = auth.user && auth.user.permissions.canSetInterestRate || auth.user.permissions.canSetCeiling ? loans!.loans : loans!.loans.filter(l => l.loanOwner === ethFrom)
    };

    return <Box>
      <Box pad={{ bottom: 'large' }}>
        <Link href={'/loans/issue'}>
          <Button alignSelf={'end'} margin={{ right: 'medium' }} primary label="Create Loan"/>
        </Link>
      </Box>
      <DataTable  style={{ tableLayout: 'auto' }} data={filteredLoans} sortable columns={[
        { header: <HeaderCell text={'Loan ID'}></HeaderCell>, property: 'loanId', align: 'end' },
        {
          header: 'NFT ID', property: 'tokenId', align: 'end',
          render: (l: InternalListLoan) =>
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
          render: (l: InternalListLoan) => <div>
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
          render: (l: InternalListLoan) => <div>
            {l.nftOwner === ethFrom && <Badge text={'Me'} />}
          </div>
        },
        {
          header: 'Principal (DAI)', property: 'principal', align: 'end',
          render: (l: InternalListLoan) => l.status === 'Whitelisted' ?
            <NumberDisplay suffix="" precision={18}
              value={baseToDisplay(l.principal, 18)} />
            : '-'
        },
        {
          header: <HeaderCell text={'Interest Rate'}></HeaderCell>, property: 'fee', align: 'end',
          render: (l: InternalListLoan) => l.status === 'Repaid' ? '-' :
            <NumberDisplay suffix="%" value={l.interestRate} />
        },
        {
          header: 'Debt (DAI)', property: 'debt', align: 'end',
          render: (l: InternalListLoan) => l.status === 'Whitelisted' ? '-' :
            <NumberDisplay suffix="" precision={18} value={baseToDisplay(l.debt, 18)} />
        },
        {
          header: 'Actions', property: 'id', align: 'end', sortable: false,
          render: (l: InternalListLoan) => {
            return  <Link href={'/loans/loan?loanId=${l.loanId}'}><Anchor>View</Anchor></Link>;
          }
        }
      ]} />
      </Box>;
  }
}

const HeaderCell = (props : {text: string}) => (
  <Box pad={{ left: 'small' }}><Text>{props.text}</Text></Box>
);

export default connect(state => state, { getLoans })(LoanList);
