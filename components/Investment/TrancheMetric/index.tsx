import * as React from 'react';
import { Box, Heading } from 'grommet';
import { Investor, Tranche } from 'tinlake';
import { TrancheType } from '../../../services/tinlake/actions';
import DashboardMetric from '../../DashboardMetric';
import { Erc20Widget } from '../../../components/erc20-widget';
import DAI from '../../../static/dai.json';

interface Props {
  investor: Investor;
  tranche: any;
  type: TrancheType;
  tinlake: any;
}

class TrancheMetric extends React.Component<Props> {

  render() {
    const { type, investor, tranche } = this.props;
    const { maxSupply, maxRedeem, tokenBalance } = investor[type];


    return <Box margin="none">
      <Box>
        <Heading level="4" margin={{ bottom: 'medium' }}>Investment overview</Heading>
        <Box direction="row" >
            <DashboardMetric label="Investor token balance">
              <Erc20Widget value={tokenBalance ? tokenBalance.toString() : '0'} tokenData={tranche.tokenData} precision={18}  />
            </DashboardMetric>
        </Box>
      </Box>

      <Box margin={{ top: 'medium' }}>
        <Heading level="4" margin={{ bottom: 'medium' }}>Invest / Redeem allowance</Heading>
        <Box direction="row" >
            <DashboardMetric label="Investment limit">
            <Erc20Widget value={maxSupply ? maxSupply.toString() : '0'} tokenData={DAI} precision={18} />
            </DashboardMetric>
            <DashboardMetric label="Redeem limit">
              <Erc20Widget value={maxRedeem ? maxRedeem.toString() : '0'} tokenData={tranche.tokenData} precision={18} />
            </DashboardMetric>
          {/* <Box basis={'1/3'} gap="medium">
            <DashboardMetric label={`Tranche token total`}>
              <NumberDisplay value={maxRedeemAmount.toString()} suffix={currencyLabel} precision={18} />
            </DashboardMetric>
          </Box> */}
        </Box>
      </Box>
    </Box>;
  }
}

export default TrancheMetric;
