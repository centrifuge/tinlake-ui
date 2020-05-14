import * as React from 'react';
import { Box, Heading } from 'grommet';
import { Investor, Tranche } from 'tinlake';
import { TrancheType } from '../../../services/tinlake/actions';
import DashboardMetric from '../../DashboardMetric';
import { Erc20Widget } from '../../../components/erc20-widget';
import DAI from '../../../static/dai.json';

interface Props {
  investor: Investor;
  tranche: Tranche;
  type: TrancheType;
  tinlake: any;
}

class TrancheMetric extends React.Component<Props> {

  render() {
    const { type, investor, tranche } = this.props;
    const { maxSupply, maxRedeem, tokenBalance } = investor[type];
    const { token  } = tranche;
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
    return <Box margin="none">
      <Box>
        <Heading level="4" margin={{ bottom: 'medium' }}>Investment overview</Heading>
        <Box direction="row" >
            <DashboardMetric label="Investor token balance">
              {token === 'DROP' && <Erc20Widget value={tokenBalance ? tokenBalance.toString() : '0'} tokenData={dropToken} precision={18}  />}
              {token === 'TIN' && <Erc20Widget value={tokenBalance ? tokenBalance.toString() : '0'} tokenData={tinToken} precision={18}  />}
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
              {token === 'DROP' && <Erc20Widget value={maxRedeem ? maxRedeem.toString() : '0'} tokenData={dropToken} precision={18} />}
              {token === 'TIN' && <Erc20Widget value={maxRedeem ? maxRedeem.toString() : '0'} tokenData={tinToken} precision={18} />}
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
