import * as React from 'react';
import { AuthState } from '../../../ducks/auth';
import { InvestorState, loadInvestor } from '../../../ducks/investments';
import { connect } from 'react-redux';
import { Box, Tab, Tabs } from 'grommet';
import Alert from '../../../components/Alert';
import { Spinner } from '@centrifuge/axis-spinner';
import { isValidAddress } from '../../../utils/address';
import TrancheView from '../Tranche';
import { TransactionState, resetTransactionState } from '../../../ducks/transactions';
import { AnalyticsState, loadAnalyticsData } from '../../../ducks/analytics';

interface Props {
  tinlake: any;
  auth: AuthState;
  loadInvestor?: (tinlake: any, address: string) => Promise<void>;
  investments?: InvestorState;
  transactions?: TransactionState;
  resetTransactionState?: () => void;
  loadAnalyticsData?: (tinlake: any) => Promise<void>;
  analytics?: AnalyticsState;
  investorAddress: string;
}

interface State {
  errorMsg: string;
  is: string | null;
}

class InvestorView extends React.Component<Props, State> {

  showInvestor = async () => {
    const { investorAddress } = this.props;
    const { loadInvestor, tinlake } = this.props;
    resetTransactionState && resetTransactionState();

    this.setState({ is: null, errorMsg: '' });
    if (!isValidAddress(investorAddress)) {
      this.setState({ is: 'error', errorMsg: 'Please input a valid Ethereum address.' });
      return;
    }
    loadInvestor && loadInvestor(tinlake, investorAddress);
  }

  componentWillMount() {
    const { resetTransactionState, loadAnalyticsData, tinlake } = this.props;
    resetTransactionState && resetTransactionState();
    loadAnalyticsData && loadAnalyticsData(tinlake);
    this.setState({ is: null, errorMsg: '' });
    this.showInvestor();
  }

  componentWillUnmount() {
    const { resetTransactionState } = this.props;
    resetTransactionState && resetTransactionState();
  }

  render() {
    const { is, errorMsg } = this.state;
    const { tinlake, investments, auth, analytics, transactions, investorAddress } = this.props;
    const investor = investments && investments.investor;
    const investorState = investments && investments.investorState;

    if (investorState && investorState === 'loading') {
      return <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading Investor information...'} />;
    }


    return <Box>

      <Box pad={{ horizontal: 'medium' }}>
        {is === 'error' && <Alert type="error">
          {errorMsg && <div>{errorMsg}</div>}
        </Alert>}
      </Box>

      {/* <Box pad={{ horizontal: 'medium' }}>
        <Box direction="row" gap="medium" margin={{ top: 'small' }}>
          <Heading level="4">Investor details shown for address:</Heading>
        </Box>
      </Box>
      <Box direction="row" gap="medium" margin={{ bottom: 'medium' }} pad={{ horizontal: 'medium' }}>
        <Box basis={'1/3'} gap="medium">
          <FormField>
            <TextInput
              disabled
              value={investorAddress}
            />
          </FormField>
        </Box>
      </Box> */}


      <Box pad={{ horizontal: 'medium', top: 'large' }} >
        <Tabs justify="center" flex="grow" >
          <Tab title='Junior tranche / TIN token' style={{
            flex: 1,
            fontWeight: 900,
          }}>
            <TrancheView transactions={transactions} tinlake={tinlake} auth={auth} investor={investor} analytics={analytics} trancheType={"junior"} />

          </Tab>
          <Tab title='Senior tranche / DROP token' style={{
            flex: 1,
            fontWeight: 900,
          }}>
            <TrancheView tinlake={tinlake} transactions={transactions} auth={auth} investor={investor} analytics={analytics} trancheType={"senior"} />
          </Tab>
        </Tabs>
      </Box>
    </Box>;
  }
}


export default connect(state => state, { loadInvestor, loadAnalyticsData, resetTransactionState })(InvestorView);
