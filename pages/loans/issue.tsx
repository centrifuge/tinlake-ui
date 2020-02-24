import * as React from 'react';
import WithTinlake from '../../components/WithTinlake';
import IssueLoan from '../../containers/Loans/Issue';
import { Box, Heading } from 'grommet';
import Header from '../../components/Header';
import SecondaryHeader from '../../components/SecondaryHeader';
import { menuItems } from '../../menuItems';
import { BackLink } from '../../components/BackLink';

interface Props {
  loanId: string;
}

class LoanPage extends React.Component<Props> {
  render() {
    const { loanId } = this.props;
    return <Box align="center">
      <Header
        selectedRoute={'/loans/issue'}
        menuItems={menuItems}
      />
      <Box
        justify="center"
        direction="row"
      >
        <Box width="xlarge" >
          <SecondaryHeader>
            <Box direction="row" gap="small" align="center">
              <BackLink href={'/loans'} />
              <Heading level="3">Open Loan</Heading>
            </Box>
          </SecondaryHeader>

          <WithTinlake render={tinlake =>
            <IssueLoan tinlake={tinlake} loanId={loanId} />
          }> </WithTinlake>
        </Box>;
      </Box>
    </Box>;
  }
}

export default LoanPage;
