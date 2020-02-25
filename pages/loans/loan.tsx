import * as React from 'react';
import WithTinlake from '../../components/WithTinlake';
import LoanView from '../../containers/Loans/View';
import { Box, Heading } from 'grommet';
import Header from '../../components/Header';
import SecondaryHeader from '../../components/SecondaryHeader';
import { menuItems } from '../../menuItems';
import { BackLink } from '../../components/BackLink';

interface Props {
  loanId: string;
}

class LoanPage extends React.Component<Props> {
  static async getInitialProps({ query }: any) {
    return { loanId: query.loanId };
  }

  render() {
    const { loanId } = this.props;
    return <Box align="center">
      <Header
        selectedRoute={'/loans/loan'}
        menuItems={menuItems}
      />
      <Box
        justify="center"
        direction="row"
      >
        <Box width="xlarge">
          <SecondaryHeader>
            <Box direction="row" gap="small" align="center">
              <BackLink href={'/loans'} />
              <Heading level="3">View Loan</Heading>
            </Box>
          </SecondaryHeader>

          {loanId && <WithTinlake render={tinlake => <LoanView tinlake={tinlake} loanId={loanId} />}> </WithTinlake>}
        </Box>;
      </Box>
    </Box>
  }
}

export default LoanPage;
