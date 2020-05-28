import * as React from 'react';
import { Box, Heading } from 'grommet';
import { baseToDisplay, Investor } from 'tinlake';
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
    if (tokenBalance > maxRedeem) {
      return baseToDisplay(maxRedeem, 18);
    }
    return baseToDisplay(tokenBalance, 18);
  }

  render() {
    const {  investor, tranche, isAdmin } = this.props;
    const { maxSupply, maxRedeem, tokenBalance } = investor[tranche.type];

    return <Box margin="none">
      <Box>
        <Heading level="4" margin={{ bottom: 'medium' }}>Investment Overview</Heading>
        <Box direction="row" >

            <DashboardMetric label={isAdmin ? 'Connected Address Token Balance' : 'Investor Address Token Balance'}>
              <Erc20Widget value={tokenBalance ? baseToDisplay(tokenBalance, 18) : '0'} tokenData={tranche.tokenData} precision={18}  />
            </DashboardMetric>

          <DashboardMetric label={tranche.type === 'senior' ? 'Current DROP Price' : 'Current TIN Price'}>
            <Erc20Widget value={tranche.tokenPrice ? baseToDisplay(tranche.tokenPrice, 27) : '0'} tokenData={DAI} precision={27} />
          </DashboardMetric>
          <DashboardMetric label={tranche.type === 'senior' ? 'DROP Investment Value' : 'TIN Investment Value'}>
            <Erc20Widget value={tokenBalance && tranche.tokenPrice ? (Number(baseToDisplay(tranche.tokenPrice, 27)) * Number(baseToDisplay(tokenBalance, 18))).toString() : '0'} tokenData={DAI} precision={18} />
          </DashboardMetric>

        </Box>
      </Box>

      <Box margin={{ top: 'medium' }}>
        <Heading level="4" margin={{ bottom: 'medium' }}>Current Invest / Redeem allowance</Heading>
        <Box direction="row" >

            <DashboardMetric label={isAdmin ? 'Admin set Investment Limit' : 'Investment Limit'}>
              <Erc20Widget value={maxSupply ? baseToDisplay(maxSupply, 18) : '0'} tokenData={DAI} precision={18} />
            </DashboardMetric>

            <DashboardMetric label={isAdmin ? 'Admin set Redeem Limit' : 'Redeem Limit'}>
             <Erc20Widget value={ isAdmin ? maxRedeem && baseToDisplay(maxRedeem, 18) : tokenBalance && maxRedeem && this.checkInvestorRedeemLimit(tokenBalance, maxRedeem)} tokenData={tranche.tokenData} precision={18} />
            </DashboardMetric>

          { isAdmin && <DashboardMetric label={tranche.type === 'senior' ? 'DROP available to redeem in tranche' : 'TIN available to redeem in tranche'}>
            <Erc20Widget value={ tranche.availableFunds ? tranche.availableFunds && baseToDisplay(tranche.availableFunds, 18) : '0'} tokenData={tranche.tokenData} precision={18} />
          </DashboardMetric>}

        </Box>
      </Box>
    </Box>;
  }
}

export default TrancheMetric;
