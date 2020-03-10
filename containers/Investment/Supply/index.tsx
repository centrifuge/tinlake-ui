import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Investor, supplyJunior } from '../../../services/tinlake/actions';
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
  supplyAmount: string;
}

class InvestorSupply extends React.Component<Props, State> {

  componentWillMount() {
    const { investor } = this.props;
    this.setState({ supplyAmount: investor && investor.maxSupplyJunior || '0' });
  }

  supplyJunior = async () => {
    this.props.transactionSubmitted && this.props.transactionSubmitted("Investment initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.");
    try {
      await authTinlake();
      const { supplyAmount } = this.state;
      const { investor, tinlake } = this.props;
      const res = await supplyJunior(tinlake, supplyAmount);
      if (res && res.errorMsg) {
        this.props.responseReceived && this.props.responseReceived(null, `Investment failed. ${res.errorMsg}`);
        return;
      }
      this.props.responseReceived && this.props.responseReceived(`Investment successful. Please check your wallet for TIN tokens.`, null);
      this.props.loadInvestor && this.props.loadInvestor(tinlake, investor.address);
    } catch (e) {
      this.props.responseReceived && this.props.responseReceived(null, `Investment failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { supplyAmount } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Investment amount">
          <NumberInput value={baseToDisplay(supplyAmount, 18)} suffix=" DAI" precision={18}
            onValueChange={({ value }) =>
              this.setState({ supplyAmount: displayToBase(value) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.supplyJunior} primary label="Invest"  />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor, transactionSubmitted, responseReceived })(InvestorSupply);