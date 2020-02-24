import * as React from 'react';
import Tinlake from 'tinlake';
import { ApolloClient } from '../../services/apollo';
import { connect } from 'react-redux';
import { Box, Heading } from 'grommet';
import SecondaryHeader from '../../components/SecondaryHeader';
import { DashboardState, subscribeDashboardData } from '../../ducks/dashboard';
import LoanList from '../../components/LoanList';

interface Props {
  tinlake: Tinlake;
  apolloClient: ApolloClient;
  dashboard?: DashboardState;
  subscribeDashboardData?: (tinlake: Tinlake) => () => void;
}

class Dashboard extends React.Component<Props> {

  render() {
    const { tinlake } = this.props;
    return <Box >
      <SecondaryHeader>
          <Heading level="3">Loans</Heading>
      </SecondaryHeader>
      <LoanList tinlake={tinlake} />
      <Box pad={{ horizontal: 'medium', vertical: 'medium' }}>
      </Box>
    </Box>;
  }
}

export default connect(state => state, { subscribeDashboardData })(Dashboard);
