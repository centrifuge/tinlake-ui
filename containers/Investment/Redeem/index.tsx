import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Investor, redeemJunior } from '../../../services/tinlake/actions';
import { transactionSubmitted, responseReceived } from '../../../ducks/transactions';
import { baseToDisplay, displayToBase } from 'tinlake';
import { loadInvestor } from '../../../ducks/investments';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';

interface Props {
  investor: Investor;
  tinlake: Tinlake;
  loadInvestor?: (tinlake: Tinlake, address: string, refresh?: boolean) => Promise<void>;
  transactionSubmitted?: (loadingMessage: string) => Promise<void>;
  responseReceived?: (successMessage: string | null, errorMessage: string | null) => Promise<void>;
}

interface State {
  redeemAmount: string;
}

class InvestorRedeem extends React.Component<Props, State> {

  componentWillMount() {
    const { investor } = this.props;
    this.setState({ redeemAmount: (investor && investor.tokenBalanceJunior || '0') });
  }

  redeemJunior = async () => {
    this.props.transactionSubmitted && this.props.transactionSubmitted("Redeem initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.");
    try {
      await authTinlake();
      const { redeemAmount } = this.state;
      const { investor, tinlake } = this.props;
      const res = await redeemJunior(tinlake, redeemAmount);
      if (res && res.errorMsg) {
        this.props.responseReceived && this.props.responseReceived(null, `Redeem failed. ${res.errorMsg}`);
        return;
      }
      this.props.responseReceived && this.props.responseReceived(`Redeem successful. Please check your wallet.`, null);
      this.props.loadInvestor && this.props.loadInvestor(tinlake, investor.address);
    } catch (e) {
      this.props.responseReceived && this.props.responseReceived(null, `Redeem failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { redeemAmount } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Redeem amount">
          <NumberInput value={baseToDisplay(redeemAmount, 18)} suffix=" TIN" precision={18}
            onValueChange={({ value }) =>
              this.setState({ redeemAmount: displayToBase(value) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.redeemJunior} primary label="Redeem" />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor, transactionSubmitted, responseReceived })(InvestorRedeem);