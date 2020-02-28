import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Investor, setAllowanceJunior } from '../../../services/tinlake/actions';
import { baseToDisplay, displayToBase } from 'tinlake';
import { loadInvestor } from '../../../ducks/investments';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';

interface Props {
  investor: Investor;
  tinlake: Tinlake;
  loadInvestor?: (tinlake: Tinlake, address: string, refresh?: boolean) => Promise<void>;
}

interface State {
  supplyAmount: string;
  redeemAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class InvestorAllowance extends React.Component<Props, State> {

  componentWillMount() {
    const { investor } = this.props;
    this.setState({ supplyAmount: (investor && investor.maxSupplyJunior || '0'), redeemAmount: (investor.maxRedeemJunior || '0') });
  }

  setJunior = async () => {
    try {
      await authTinlake();
      const { supplyAmount, redeemAmount } = this.state;
      const { investor, tinlake } = this.props;
      
      this.setState({ is: 'loading' });

      const res = await setAllowanceJunior(tinlake, investor.address, supplyAmount, redeemAmount);
      if (res && res.errorMsg) {
        this.setState({ is: 'error' });
        return;
      }
      this.setState({ is: 'success' });
      this.props.loadInvestor && this.props.loadInvestor(tinlake, investor.address);
    } catch (e) {
      console.log(e);
    }
}

  render() {
    const { supplyAmount, redeemAmount, is} = this.state;
    return <Box gap="medium" direction="row" margin={{ right: "large" }}>
       <Box basis={'1/3'}>
          <FormField label="Maximum junior supply amount">
            <NumberInput value={baseToDisplay(supplyAmount, 18)} suffix=" DAI" precision={18}
              onValueChange={({ value }) =>
                this.setState({ supplyAmount: displayToBase(value) })}
            />
          </FormField>
        </Box>
        <Box basis={'1/3'}>
          <FormField label="Maximum junior redeem amount">
            <NumberInput value={baseToDisplay(redeemAmount, 18)} suffix=" DAI" precision={18}
              onValueChange={({ value }) =>
                this.setState({ redeemAmount: displayToBase(value) })}
            />
          </FormField>
        </Box>
        <Box >
          <Button onClick={this.setJunior} primary label="Set junior limits" disabled={is === 'loading'} />
        </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor })(InvestorAllowance);