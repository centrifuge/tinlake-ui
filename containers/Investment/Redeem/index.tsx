import * as React from 'react';
import { Box, Button, Text } from 'grommet';
import { redeem, TrancheType } from '../../../services/tinlake/actions';
import { transactionSubmitted, responseReceived } from '../../../ducks/transactions';
import { baseToDisplay, displayToBase, Investor, Tranche } from 'tinlake';
import { loadInvestor } from '../../../ducks/investments';
import { loadPool } from '../../../ducks/pool';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';
import BN from 'bn.js';
import { Erc20Widget } from '../../../components/erc20-widget';
interface Props {
  investor: Investor;
  tinlake: any;
  loadInvestor?: (tinlake: any, address: string, refresh?: boolean) => Promise<void>;
  loadPool?: (tinlake: any) => Promise<void>;
  transactionSubmitted?: (loadingMessage: string) => Promise<void>;
  responseReceived?: (successMessage: string | null, errorMessage: string | null) => Promise<void>;
  tranche: Tranche;
}

interface State {
  redeemAmount: string;
}

class InvestorRedeem extends React.Component<Props, State> {
  state: State = {
    redeemAmount: '0'
  };

  redeem = async () => {
    const { tranche, transactionSubmitted, responseReceived, loadInvestor, loadPool, investor, tinlake } = this.props;
    const { redeemAmount } = this.state;
    transactionSubmitted && transactionSubmitted('Redeem initiated. Please confirm the pending transactions in MetaMask. Processing may take a few seconds.');
    try {
      await authTinlake();
      const res = await redeem(tinlake, redeemAmount, tranche.type as any as TrancheType);
      if (res && res.errorMsg) {
        responseReceived && responseReceived(null, `Redeem failed. ${res.errorMsg}`);
        return;
      }
      responseReceived && responseReceived('Redeem successful. Please check your wallet.', null);
      loadInvestor && loadInvestor(tinlake, investor.address);
      loadPool && loadPool(tinlake);
    } catch (e) {
      responseReceived && responseReceived(null, `Redeem failed. ${e}`);
      console.log(e);
    }
  }

  render() {
    const { investor, tranche } = this.props;
    const { redeemAmount } = this.state;
    const trancheValues = investor[tranche.type as any as TrancheType];
    const maxRedeemAmount = trancheValues.maxRedeem || '0';
    const tokenBalance = trancheValues.tokenBalance || '0';
    const redeemLimitSet = maxRedeemAmount.toString() !== '0';
    const limitOverflow = (new BN(redeemAmount).cmp(new BN(maxRedeemAmount)) > 0);
    const availableTokensOverflow = (new BN(redeemAmount).cmp(new BN(tokenBalance)) > 0);
    const redeemEnabled = redeemLimitSet && !limitOverflow && !availableTokensOverflow;

    const dropAddress = this.props.tinlake.contractAddresses.SENIOR_TOKEN as string;
    const tinAddress = this.props.tinlake.contractAddresses.JUNIOR_TOKEN as string;
    const dropToken = {
      [dropAddress] : {
        symbol: 'DROP',
        logo: '../../static/DROP_final.svg',
        decimals: 18,
        name: 'DROP'
      }
    };
    const tinToken = {
      [tinAddress] : {
        symbol: 'TIN',
        logo: '../../static/TIN_final.svg',
        decimals: 18,
        name: 'TIN'
      }
    };
    return <Box basis={'1/4'} gap="medium" margin={{ right: 'large' }}>
      <Box gap="medium">
        {tranche.type === 'senior' && <Erc20Widget input={true} fieldLabel="Redeem token" limit={300000000000000000} tokenData={dropToken} precision={18} onValueChanged={(value : string) =>
                this.setState({ redeemAmount: displayToBase(value, 18) })}
                errorMessage="Max redeem amount exceeded" />}
        {tranche.type === 'junior' && <Erc20Widget input={true} fieldLabel="Redeem token" limit={maxRedeemAmount.toString()} tokenData={tinToken} precision={18} onValueChanged={(value : string) =>
                this.setState({ redeemAmount: displayToBase(value, 18) })}
                errorMessage="Max redeem amount exceeded" />}
      </Box>
      <Box align="start">
        <Button onClick={this.redeem} primary label="Redeem" disabled = {!redeemEnabled}/>

        {availableTokensOverflow  &&
          <Box margin={{ top: 'small' }}>
            Available token amount exceeded.   <br />
            Amount has to be lower then <br />
            <Text weight="bold">
              {`${baseToDisplay(tokenBalance, 18)}`}
            </Text>
          </Box>
        }

      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor, loadPool, transactionSubmitted, responseReceived })(InvestorRedeem);
