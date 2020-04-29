import * as React from 'react';
import{ bnToHex, baseToDisplay, feeToInterestRate } from 'tinlake';
import Link from 'next/link';
import { Box, DataTable, Anchor, Text } from 'grommet';
import { Loan } from '../../../services/tinlake/actions';
import NumberDisplay from '../../../components/NumberDisplay';
import Badge from '../../../components/Badge';
import { DisplayField } from '@centrifuge/axis-display-field';
import { getNFTLink, hexToInt } from '../../../utils/etherscanLinkGenerator';

interface Props {
  loans: Array<Loan>;
  userAddress: string;
  proxies: Array<string>
}

class LoanList extends React.Component<Props> {

  componentWillMount() {

  }

  render() {
    const { loans, userAddress, proxies } =  this.props;
    return <Box margin={{bottom: "xlarge"}}>
      <DataTable style={{ tableLayout: 'auto' }} data={loans} sortable columns={[
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
            {userAddress && proxies.includes(userAddress) && <Badge text={'Me'} />}
          </div>
        },
        {
          header: 'Debt (DAI)', property: 'debt', align: 'end',
          render: (l: Loan) =>
            <NumberDisplay suffix="" precision={4}
              value={baseToDisplay(l.debt, 18)} />
        },
        {
          header: 'Max borrow amount (DAI)', property: 'principal', align: 'end',
          render: (l: Loan) =>
            <NumberDisplay suffix="" precision={4}
              value={baseToDisplay(l.principal, 18)} />
        },
        {
          header: <HeaderCell text={'Annual interest rate (APR)'}></HeaderCell>, property: 'fee', align: 'end',
          render: (l: Loan) => l.status === 'Repaid' ? '-' :
            <NumberDisplay suffix="%" value={feeToInterestRate(l.interestRate)} />
        },
        {
          header: 'Loan Status', property: 'status', align: 'end',
          render: (l: Loan) => l.status
        },
        {
          header: 'Actions', property: 'id', align: 'end', sortable: false,
          render: (l: Loan) => {
            return <Link href={{ pathname: `/loans/loan`, query: {loanId: l.loanId } }}><Anchor>View</Anchor></Link>;
          }
        }
      ]} />
    </Box>;
  }
}
const HeaderCell = (props: { text: string }) => (
  <Box pad={{ left: 'small' }}><Text>{props.text}</Text></Box>
);

export default LoanList;
