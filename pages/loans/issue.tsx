import * as React from 'react';
import WithTinlake from '../../components/WithTinlake';
import LoanIssue from '../../components/IssueLoan';
import { Box } from 'grommet';
import Header from '../../components/Header';
import { menuItems } from '../../menuItems';

class IssuePage extends React.Component {

  componentWillMount() {
  }
  render() {
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
            <WithTinlake render={tinlake =>
              <LoanIssue tinlake={tinlake} mode="loans" />
            } />
        </Box>
      </Box>
    </Box>;
  }
}

export default IssuePage;
