import * as React from 'react';
import { Box } from 'grommet';
import { baseToDisplay } from 'tinlake';
import BN from 'bn.js';
import NumberDisplay from '../../NumberDisplay';
import DashboardMetric from '../../DashboardMetric';

interface Props {
  data: any;
}

class InvestmentsOverview extends React.Component<Props> {
  render() {
    const { minJuniorRatio, currentJuniorRatio, senior} = this.props.data;
    const dropInterestRate = senior && senior.interestRate || new BN(0);
   
    return <Box> 
      <Box direction="row" >
        <Box basis={'1/3'} >
          <DashboardMetric label={`Current TIN/DROP ratio`} >
            <NumberDisplay value={baseToDisplay(currentJuniorRatio, 27)} precision={2} />
          </DashboardMetric>
        </Box>

        <Box basis={'1/3'} >
          <DashboardMetric label={`Minimum TIN/DROP ratio`} >
            <NumberDisplay value={baseToDisplay(minJuniorRatio, 27)} precision={2} />
          </DashboardMetric>
        </Box>
        <Box basis={'1/3'}  >
          <DashboardMetric label={`DROP interest rate`}  >
            <NumberDisplay value={baseToDisplay(dropInterestRate, 27)} precision={2} > </NumberDisplay>
          </DashboardMetric>
        </Box>
      </Box>
    </Box>;
  }
}

export default InvestmentsOverview;
