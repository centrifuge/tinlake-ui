import * as React from 'react';
import { Box, FormField, Button, Heading } from 'grommet';
import { Investor, TrancheType, setAllowance } from '../../../services/tinlake/actions';
import { transactionSubmitted, responseReceived } from '../../../ducks/transactions';
import { displayToBase, Investor } from 'tinlake';
import { loadInvestor } from '../../../ducks/investments';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';
import { Erc20Widget } from '../../../components/Investment/TrancheMetric/erc20';
import DAI from '../../../static/dai.json';
import DROP from '../../../static/drop.json';

interface Props {
  investor: Investor;
  tinlake: any;
  loadInvestor?: (tinlake: any, address: string, refresh?: boolean) => Promise<void>;
  transactionSubmitted?: (loadingMessage: string) => Promise<void>;
  responseReceived?: (successMessage: string | null, errorMessage: string | null) => Promise<void>;
  trancheType: TrancheType;
}

interface State {
  supplyAmount: string;
  redeemAmount: string;
  currentSupplyLimit: string;
  currentRedeemLimit: string;
}

class InvestorAllowance extends React.Component<Props, State> {

  updateLimits() {
    if (!this.state) {
      return;
    }
    const { investor, trancheType } = this.props;
    const { currentSupplyLimit, currentRedeemLimit } = this.state;
    const tranche = investor[trancheType];
    if ((tranche.maxSupply && currentSupplyLimit !== tranche.maxSupply.toString()) ||
      (tranche.maxRedeem && currentRedeemLimit !== tranche.maxRedeem.toString())) {
      this.setState({
        currentSupplyLimit: (tranche.maxSupply && tranche.maxSupply.toString()) || '0',
        currentRedeemLimit: (tranche.maxRedeem && tranche.maxRedeem.toString()) || '0',
        supplyAmount: (tranche.maxSupply && tranche.maxSupply.toString()) || '0',
        redeemAmount: (tranche.maxRedeem && tranche.maxRedeem.toString()) || '0'
      });
    }
  }
  componentDidMount() {
    this.setState({
      supplyAmount: '0',
      redeemAmount: '0',
      currentSupplyLimit: '0',
      currentRedeemLimit: '0'
    });
    this.updateLimits();
  }

  setAllowance = async () => {
    this.props.transactionSubmitted && this.props.transactionSubmitted('Allowance initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.');
    try {
      await authTinlake();
      this.updateLimits();
      const { supplyAmount, redeemAmount } = this.state;

      const { investor, trancheType, tinlake } = this.props;
      const res = await setAllowance(tinlake, investor.address, supplyAmount, redeemAmount, trancheType);
      if (res && res.errorMsg) {
        this.props.responseReceived && this.props.responseReceived(null, `Allowance failed. ${res.errorMsg}`);
        return;
      }
      this.props.responseReceived && this.props.responseReceived('Allowance successful.', null);
      this.props.loadInvestor && this.props.loadInvestor(tinlake, investor.address);
    } catch (e) {
      this.props.responseReceived && this.props.responseReceived(null, `Allowance failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { supplyAmount, redeemAmount } = this.state;
    this.updateLimits();
    return <Box>
      <Box gap="medium" align="start" margin={{ bottom: 'medium' }} >
        <Heading level="4" margin="none"> Set allowance </Heading>
      </Box>
      <Box gap="medium" direction="row" margin={{ right: 'large' }}>
        <Box basis={'1/3'}>
          <FormField label="Max investment amount">
          <Erc20Widget limit={supplyAmount.toString()} tokenData={DAI} precision={18} onValueChanged={(value) =>
                this.setState({ supplyAmount: displayToBase(value, 18) })} />
          </FormField>
        </Box>
        <Box basis={'1/3'}>
          <FormField label="Max redeem amount">
          <Erc20Widget limit={redeemAmount.toString()} tokenData={DROP} precision={18} onValueChanged={(value) =>
                this.setState({ redeemAmount: displayToBase(value, 18) })} />
          </FormField>
        </Box>
        <Box >
          <Button onClick={this.setAllowance} primary label="Set Allowance" />
        </Box>
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor, transactionSubmitted, responseReceived })(InvestorAllowance);
