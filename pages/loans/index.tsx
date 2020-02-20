import * as React from 'react';
import LoanList from '../../components/LoanList';
import WithTinlake from '../../components/WithTinlake';
import { Box, Heading } from 'grommet';
import Header from '../../components/Header';
import { menuItems } from '../../menuItems';
import SecondaryHeader from '../../components/SecondaryHeader';
import Auth from '../../components/Auth';
import Alert from '../../components/Alert';

class LoanListPage extends React.Component {

  render() {
    return <Box align="center">
      <Header
        selectedRoute={'/loans'}
        menuItems={menuItems}
      />
      <Box
        justify="center"
        direction="row"
      >
        <Box width="xlarge" >
          <WithTinlake render={tinlake =>
            <Box>
              <SecondaryHeader>
                <Heading level="3">Loans</Heading>
              </SecondaryHeader>

              <Auth tinlake={tinlake} waitForAuthentication waitForAuthorization render={auth =>
                auth.user === null &&
                  <Alert margin="medium" type="error">
                    Please authenticate to view your loans.
                  </Alert>
              } />
              <LoanList tinlake={tinlake} />
            </Box>
          } />
        </Box>
      </Box>
    </Box>;
  }
}

export default LoanListPage;
