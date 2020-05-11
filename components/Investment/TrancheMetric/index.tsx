import * as React from 'react';
import { Box, Heading } from 'grommet';
import { Investor, Tranche, TrancheType } from '../../../services/tinlake/actions';
import DashboardMetric from '../../DashboardMetric';
import { Erc20Widget } from './erc20';
import DAI from "../../../static/dai.json"
import DROP from "../../../static/drop.json"

interface Props {
  investor: Investor;
  tranche: Tranche;
  type: TrancheType;
}

class TrancheMetric extends React.Component<Props> {
  render() {
    const { type, investor, tranche } = this.props;
    const { maxSupply, maxRedeem, tokenBalance } = investor[type];
    const { token  } = tranche;
    const currencyLabel = ` ${token}`;
      
    return <Box margin="none">
      <Box>
        <Heading level="4" margin={{ bottom: 'medium' }}>Investment overview</Heading>
        <Box direction="row" >
          <Box basis={'1/3'} gap="medium">
            <DashboardMetric label="Investor token balance">    
              <Erc20Widget value={tokenBalance.toString()} tokenData={DROP} precision={18} />
            </DashboardMetric>
          </Box>
        </Box>
      </Box>

      <Box margin={{ top: 'medium' }}>
        <Heading level="4" margin={{ bottom: 'medium' }}>Invest / Redeem allowance</Heading>
        <Box direction="row" >
          <Box basis={'1/3'} gap="medium">
            <DashboardMetric label="Investment limit">
              <Erc20Widget value={maxSupply.toString()} tokenData={DAI} precision={12} />
            </DashboardMetric>
          </Box>
          <Box basis={'1/3'} gap="medium">
            <DashboardMetric label="Redeem limit">
              <Erc20Widget value={maxRedeem.toString()} tokenData={DROP} precision={18} />
            </DashboardMetric>
          </Box>
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
