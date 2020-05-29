import * as React from 'react';
import { Box, Heading } from 'grommet';
import { baseToDisplay, displayToBase, Investor } from 'tinlake';
import DashboardMetric from '../../DashboardMetric';
import DAI from '../../../static/dai.json';
import BN from 'bn.js';
import { Tranche } from '../../../services/tinlake/actions';
import ERC20Display from '../../ERC20Display';

interface Props {
  investor: Investor;
  isAdmin: boolean;
  tranche: Tranche;
}

class TrancheMetric extends React.Component<Props> {

  checkInvestorRedeemLimit(tokenBalance: BN, maxRedeem: BN) {
    if (tokenBalance.cmp(maxRedeem) > 0) {
      return baseToDisplay(maxRedeem, 18);
    }
    return baseToDisplay(tokenBalance, 18);
  }

  calculateInvestmentValue(tokenBalance: BN, tokenPrice: BN) {
    const balance = Number(baseToDisplay(tokenBalance!.toString(), 18));
    const price = Number(baseToDisplay(tokenPrice, 27));
    return displayToBase((balance * price).toString(), 18);
  }

  calculateTokenPrice(tokenPrice: BN) {
    const price = Number(baseToDisplay(tokenPrice, 27));
    return displayToBase(price.toString(), 18);
  }

  render() {
    const {
      investor,
      tranche,
      isAdmin } = this.props;
    const { maxSupply, maxRedeem, tokenBalance } = investor[tranche.type];
    const priceLabel = `Current ${tranche.token} Price`;
    const investmentValueLabel = `${tranche.token} Investment Value`;
    const availableTokenLabel = `${tranche.token} available to redeem in tranche`;

    return <Box margin="none">
      <Box>
        <Heading level="4" margin={{ bottom: 'medium' }}>Investment Overview</Heading>
        <Box direction="row" >

            <DashboardMetric label={isAdmin ? 'Connected Address Token Balance' : 'Investor Address Token Balance'}>
              <ERC20Display value={tokenBalance ? tokenBalance.toString() : '0'} tokenMetas={tranche.tokenData} precision={18}  />
            </DashboardMetric>

          <DashboardMetric label={priceLabel}>
            <ERC20Display value={tranche.tokenPrice ? this.calculateTokenPrice(tranche.tokenPrice) : '0'} tokenMetas={DAI} precision={18} />
          </DashboardMetric>
          <DashboardMetric label={investmentValueLabel}>
            <ERC20Display value={tokenBalance && tranche.tokenPrice ? this.calculateInvestmentValue(tokenBalance, tranche.tokenPrice) : '0'} tokenMetas={DAI} precision={18} />
          </DashboardMetric>

        </Box>
      </Box>

      <Box margin={{ top: 'medium' }}>
        <Heading level="4" margin={{ bottom: 'medium' }}>Current Invest / Redeem allowance</Heading>
        <Box direction="row" >

            <DashboardMetric label={isAdmin ? 'Admin set Investment Limit' : 'Investment Limit'}>
              <ERC20Display value={maxSupply ? maxSupply.toString() : '0'} tokenMetas={DAI} precision={18} />
            </DashboardMetric>

            <DashboardMetric label={isAdmin ? 'Admin set Redeem Limit' : 'Redeem Limit'}>
              <ERC20Display value={ isAdmin ? maxRedeem && maxRedeem.toString() || '' : tokenBalance && maxRedeem && this.checkInvestorRedeemLimit(tokenBalance, maxRedeem) || ''} tokenMetas={tranche.tokenData} precision={18} />
            </DashboardMetric>

          { isAdmin && <DashboardMetric label={availableTokenLabel}>
            <ERC20Display value={ tranche.availableFunds ? tranche.availableFunds && tranche.availableFunds.toString() : '0'} tokenMetas={tranche.tokenData} precision={18} />
          </DashboardMetric>}
        </Box>
      </Box>
    </Box>;
  }
}

export default TrancheMetric;
