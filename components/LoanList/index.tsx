import * as React from 'react';
import Tinlake, { bnToHex, baseToDisplay, feeToInterestRate } from 'tinlake';
import Link from 'next/link';
import { Box, DataTable, Anchor, Text } from 'grommet';
import { connect } from 'react-redux';
import { InternalListLoan, LoansState, getLoans } from '../../ducks/loans';
import Address from '../Address';
import NumberDisplay from '../NumberDisplay';
import Badge from '../Badge';
import { Spinner } from '@centrifuge/axis-spinner';

interface Props {
  tinlake: Tinlake;
  loans?: LoansState;
  getLoans?: (tinlake: Tinlake) => Promise<void>;
  mode: 'borrower' | 'admin' | '';
}

class LoanList extends React.Component<Props> {
  componentWillMount() {
    this.props.getLoans!(this.props.tinlake);
  }

  render() {
    const { loans, mode, tinlake: { ethConfig: { from: ethFrom } } } = this.props;
    const filteredLoans = mode === 'borrower' ? loans!.loans.filter(l => l.loanOwner === ethFrom) :
      loans!.loans;
    if (loans!.loansState === 'loading') {
      return <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading...'} />;
    }

    return <Box pad={{ horizontal: 'medium', bottom: 'large' }}>
      <DataTable data={filteredLoans} sortable columns={[
        {
          header: <HeaderCell text={'Loan ID'}></HeaderCell>,
          property: 'loanId',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              <Text>{l.loanId}</Text>
            </Box>
        },
        {
          header: <HeaderCell text={'NFT ID'}></HeaderCell>,
          property: 'tokenId',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              <Address address={bnToHex(l.tokenId).toString()} />
            </Box>
        },
        {
          header: <HeaderCell text={'NFT Owner'}></HeaderCell>,
          property: 'nftOwner',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box direction="row" pad={{ left: 'small' }}>
              <Address address={l.nftOwner} />
              { l.nftOwner === ethFrom && <Badge text={'Me'} style={{ marginLeft: 5 }} /> }
            </Box>
        },
        {
          header: <HeaderCell text={'NFT Status'}></HeaderCell>,
          property: 'status',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              <Text>{l.status}</Text>
            </Box>
        },
        {
          header: <HeaderCell text={'Principal'}></HeaderCell>,
          property: 'principal',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              { l.status === 'Whitelisted' ?
                <NumberDisplay suffix=" DAI" precision={18}
                value={baseToDisplay(l.principal, 18)} />
              : '-'}
            </Box>
        },
        {
          header: <HeaderCell text={'Interest rate'}></HeaderCell>,
          property: 'fee',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              { l.status === 'Repaid' ? '-' :
              <NumberDisplay suffix="%" value={feeToInterestRate(l.fee)} />
              }
            </Box>
        },
        {
          header: <HeaderCell text={'Debt'}></HeaderCell>,
          property: 'debt',
          align: 'end',
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              { l.status === 'Whitelisted' ? '-' :
              <NumberDisplay suffix=" DAI" precision={18} value={baseToDisplay(l.debt, 18)} />
              }
            </Box>
        },
        {
          header: <HeaderCell text={'Actions'}></HeaderCell>,
          property: 'id',
          align: 'end',
          sortable: false,
          render: (l: InternalListLoan) =>
            <Box pad={{ left: 'small' }}>
              <Link href={`${mode}/loan?loanId=${l.loanId}`}><Anchor>View</Anchor></Link>
            </Box>
        }
      ]} />
    </Box>;
  }
}

const HeaderCell = (props : {text: string}) => (
  <Box pad={{ left: 'small' }}><Text>{ props.text }</Text></Box>
);

export default connect(state => state, { getLoans })(LoanList);
