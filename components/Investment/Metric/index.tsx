import * as React from 'react';
import { Box } from 'grommet';
import { baseToDisplay } from 'tinlake';
import NumberDisplay from '../../NumberDisplay';
import { Investor } from '../../../services/tinlake/actions';
import DashboardMetric from '../../DashboardMetric';

interface Props {
  investor: Investor;
}

class InvestorMetric extends React.Component<Props> {
  render() {
    const { tokenBalanceJunior, maxSupplyJunior, maxRedeemJunior } =  this.props.investor;

    return <Box pad={{ horizontal: 'medium' }}>
    <Box direction="row" gap="medium" margin={{ vertical: 'medium' }}>
      <Box basis={'1/2'} gap="medium">
        <DashboardMetric label="Junior token balance">
            <NumberDisplay value={baseToDisplay(tokenBalanceJunior, 18)} suffix=" TIN" precision={18} />
        </DashboardMetric>
      </Box>

      <Box basis={'1/2'} gap="medium">
        <DashboardMetric label="Junior maximum supply amount">
            <NumberDisplay value={baseToDisplay(maxSupplyJunior, 18)} suffix=" DAI" precision={18} />
        </DashboardMetric>
      </Box>
      {/* <Box basis={'1/3'} gap="medium">
        <DashboardMetric label="Junior maximum redeem amount">
            <NumberDisplay value={baseToDisplay(maxRedeemJunior, 18)} suffix=" TIN" precision={18} />
        </DashboardMetric>
      </Box> */}
    </Box>
  </Box>;
  }
}

export default InvestorMetric;

